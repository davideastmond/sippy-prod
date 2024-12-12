export interface ResidentRequestCollation {
  id: string; // Unique identifier for the request
  requestedTimeSlot: { 
    startTime: string; // Start Time
    endTime: string;   // End Time
  }; 
  address: {
    latitude: number; // lat num
    longitude: number; // long num
    city: string; // City name
    streetName: string; // validation: Street name
    streetNumber: string; // validation: Street number
    zipCode: string; // validation: Postal code
    googleAddressComponents?: google.maps.GeocoderAddressComponent[]; 
    // validation: Address components from Google Geocoding API
    geometry?: google.maps.places.PlaceGeometry; 
    // 
  };
  user: {
    id: string; // Unique identifier for the user associated with the request
    name: string; // User's full name
    email: string; // User's email address
  };
  distanceFromPrevious?: number; // Optional: Distance from the previous address in meters
  routeDetails?: { 
    startIndex: number; // Optional: Index of the starting point in the route
    endIndex: number;   // Optional: Index of the ending point in the route
  };
}
