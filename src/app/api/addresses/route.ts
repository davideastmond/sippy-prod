import { NextResponse } from "next/server";

// Your Google API key is used here as an environment variable
const GOOGLEMAPS_API_KEY = process.env.GOOGLEMAPS_API_KEY;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  // Fetch suggestions from the Google Places API based on the address query
  try {
    const googleResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        query
      )}&types=address&components=country:US&key=${GOOGLEMAPS_API_KEY}`
    );

    if (!googleResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data from Google Places API" },
        { status: googleResponse.status }
      );
    }

    const placesAutocompleteResponse: google.maps.places.AutocompleteResponse =
      await googleResponse.json();

    // Filter addresses that include "Los Angeles" and create an array of suggestions
    const suggestions = placesAutocompleteResponse.predictions
      .filter((prediction: any) =>
        prediction.description.includes("Los Angeles")
      )
      .map((prediction: any) => prediction.description);

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Error fetching Google Places API data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
