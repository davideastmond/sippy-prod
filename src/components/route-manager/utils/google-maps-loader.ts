import { Loader } from "@googlemaps/js-api-loader";

export const googleMapsLoader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLEMAPS_API_KEY!,
  version: "weekly",
  libraries: ["places", "maps", "routes"],
});
