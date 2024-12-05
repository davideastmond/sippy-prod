export interface ResidentRequestCollation {
  id: string; // Unique identifier for the request
  requestedTimeSlot: { startTime: string; endTime: string }; // Time slot details
  address: {
    latitude: number; // Latitude from the database
    longitude: number; // Longitude from the database
    city: string; // City information
    streetName?: string; // Optional street name
    streetNumber?: string; // Optional street number
    zipCode?: string; // Optional zip code
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  distanceFromPrevious?: number; // Optional, for route optimization
}
