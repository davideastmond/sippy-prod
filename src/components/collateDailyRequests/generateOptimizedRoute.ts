// import { Client } from "@googlemaps/google-maps-services-js";
// import { ResidentRequestCollation } from "../../types/resident-request-collation";
// import { TimeSlot } from "@/types/time-slot";

// const client = new Client({});
// const GOOGLE_MAPS_API_KEY = process.env.GOOGLEMAPS_API_KEY;

// // Function to fetch optimized route from Google Maps API
// async function fetchGoogleOptimizedRoute(
//   locations: { latitude: number; longitude: number }[]
// ): Promise<{ latitude: number; longitude: number }[]> {
//   try {
//     const waypoints = locations
//       .slice(1, -1) // Exclude the first and last locations for waypoints
//       .map((loc) => `${loc.latitude},${loc.longitude}`);
//     const origin = `${locations[0].latitude},${locations[0].longitude}`;
//     const destination = `${locations[locations.length - 1].latitude},${locations[locations.length - 1].longitude}`;

//     const response = await client.directions({
//       params: {
//         origin,
//         destination,
//         waypoints,
//         optimizeWaypoints: true,
//         key: GOOGLE_MAPS_API_KEY as string,
//       },
//     });

//     const optimizedRoute = response.data.routes[0].legs.flatMap((leg) =>
//       leg.steps.map((step) => ({
//         latitude: step.end_location.lat,
//         longitude: step.end_location.lng,
//       }))
//     );

//     return optimizedRoute;
//   } catch (error) {
//     console.error("Error fetching route from Google Maps:", error);
//     throw error;
//   }
// }

// // Main function to generate optimized routes
// export async function generateOptimizedRoute(): Promise<
//   Record<TimeSlot, ResidentRequestCollation[]>
// > {
//   const groupedRequests = await collateDailyRequests();

//   const optimizedRoutes: Record<TimeSlot, ResidentRequestCollation[]> = {
//     [TimeSlot.Morning]: [],
//     [TimeSlot.Daytime]: [],
//     [TimeSlot.Evening]: [],
//   };

//   for (const [timeSlot, requests] of Object.entries(groupedRequests)) {
//     if (requests.length < 2) {
//       console.warn(`Skipping time slot ${timeSlot} with less than 2 requests.`);
//       optimizedRoutes[timeSlot as TimeSlot] = requests;
//       continue;
//     }

//     const locations = requests.map((req) => ({
//       latitude: req.address.latitude,
//       longitude: req.address.longitude,
//     }));

//     const optimizedLocations = await fetchGoogleOptimizedRoute(locations);

//     // Map the optimized locations back to requests
//     optimizedRoutes[timeSlot as TimeSlot] = optimizedLocations.map((loc) => {
//       const matchedRequest = requests.find(
//         (req) =>
//           req.address.latitude === loc.latitude &&
//           req.address.longitude === loc.longitude
//       );
//       if (!matchedRequest) {
//         console.warn("Unmatched location in optimized route:", loc);
//         return null;
//       }
//       return matchedRequest;
//     }).filter(Boolean) as ResidentRequestCollation[];
//   }

//   return optimizedRoutes;
// }
