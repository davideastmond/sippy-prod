import { Loader } from "@googlemaps/js-api-loader";

export const googleMapsLoader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLEMAPS_API_KEY!,
  version: "weekly",
  libraries: ["places", "maps", "routes"],
});

interface Location {
  latitude: number;
  longitude: number;
  name: string;
}

interface LocationData {
  defaultLat: number;
  defaultLng: number;
  locations: Location[];
}

export async function fetchLocationData(): Promise<LocationData> {
  const response = await fetch("/api/locations");
  if (!response.ok) {
    throw new Error(`Failed to fetch location data: ${response.statusText}`);
  }
  return response.json(); // Automatically inferred as LocationData
}

export async function initializeMapWithJson() {
  await googleMapsLoader.load();

  const locationData = await fetchLocationData();

  const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center: { lat: locationData.defaultLat, lng: locationData.defaultLng },
    zoom: 8,
  });

  locationData.locations.forEach((location) => {
    new google.maps.Marker({
      position: { lat: location.latitude, lng: location.longitude },
      map: map,
      title: location.name,
    });
  });
}
