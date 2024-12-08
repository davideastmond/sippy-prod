export interface ResidentRequestCollation {
  id: string; 
  requestedTimeSlot: { startTime: string; endTime: string }; // Time slot details
  address: {
    latitude: number; // Latitude from the database
    longitude: number; // Longitude from the database
    city: string; 
    streetName?: string;
    streetNumber?: string; 
    zipCode?: string; 
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  distanceFromPrevious?: number; // Optional, for route optimization
}
