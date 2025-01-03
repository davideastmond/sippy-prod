import { Address } from "@prisma/client";

export interface GoogleAddressData {
  description: string;
  place_id: string;
  address: Address & { id?: never };
}

export interface LatLng {
  latitude: number;
  longitude: number;
}
