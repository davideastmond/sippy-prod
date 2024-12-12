import { googleMapsLoader } from "./loader";
import { ResidentRequestCollation } from "@/types/resident-request-collation";

export async function collateDailyRequests(
  requests: Record<string, ResidentRequestCollation[]>
) {
  try {
    // Load the Google Maps API using the shared loader
    await googleMapsLoader.load();

    // Initialize DirectionsService
    const directionsService = new google.maps.DirectionsService();

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

      // Compute the route
      directionsService.route(routeRequest, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result?.routes[0]) {
          console.info(`Route for ${key} computed successfully:`, result.routes[0]);
          // Process route data as needed here
        } else {
          console.error(`Failed to compute route for ${key}:`, status);
        }
      });
    }
  } catch (error) {
    console.error("Error processing routes with Google Maps API:", error);
    throw error;
  }
}
