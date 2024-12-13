import { ResidentRequestCollation } from "@/types/resident-request-collation";

export async function collateDailyRequests(
  requests: Record<string, ResidentRequestCollation[]>
): Promise<ResidentRequestCollation[]> {
  try {
    const directionsService = new google.maps.DirectionsService();

    const allRoutes: ResidentRequestCollation[] = [];

    for (const [key, collations] of Object.entries(requests)) {
      if (collations.length < 2) {
        console.warn(`Skipping route processing for ${key}: insufficient locations.`);
        continue;
      }

      // Prepare waypoints (skip origin and destination)
      const waypoints = collations.slice(1, -1).map((collation) => ({
        location: {
          lat: collation.address.latitude,
          lng: collation.address.longitude,
        },
        stopover: true,
      }));

      // Define route request
      const routeRequest: google.maps.DirectionsRequest = {
        origin: {
          lat: collations[0].address.latitude,
          lng: collations[0].address.longitude,
        },
        destination: {
          lat: collations[collations.length - 1].address.latitude,
          lng: collations[collations.length - 1].address.longitude,
        },
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      };

      try {
        // Compute the route
        const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) =>
          directionsService.route(routeRequest, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK && result) {
              resolve(result);
            } else {
              reject(new Error(`Failed to compute route for ${key}: ${status}`));
            }
          })
        );

        console.info(`Route for ${key} computed successfully:`, result.routes[0]);

        // Add processed route data to allRoutes
        allRoutes.push(
          ...collations.map((collation) => ({
            ...collation,
            routeInfo: result.routes[0], // Add custom processing as needed
          }))
        );
      } catch (routeError) {
        console.error(routeError);
      }
    }

    return allRoutes;
  } catch (error) {
    console.error("Error processing routes with Google Maps API:", error);
    throw error;
  }
}
