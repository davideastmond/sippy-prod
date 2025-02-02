import { LatLng } from "@/types/google-address-data";
import { TimeSlot } from "@/types/time-slot";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { getTimeSlotHours } from "../time-slot/time-slot";
import { SIPPY_WAREHOUSE } from "./definitions";
dayjs.extend(utc);
dayjs.extend(timezone);

export type GoogleRouteLeg = {
  distanceMeters: number;
  duration: string;
  polyline: string;
  startLocation: { latLng: LatLng };
  endLocation: { latLng: LatLng };
};

export type RouteResponseData = {
  legs: GoogleRouteLeg[];
};

// We'll use the directions
const GOOGLE_ROUTES_API =
  "https://routes.googleapis.com/directions/v2:computeRoutes";

export async function computeRoute({
  timeSlot,
  forDate,
  groupedLatLongs,
}: {
  timeSlot: TimeSlot;
  forDate: string;
  groupedLatLongs: LatLng[];
}): Promise<RouteResponseData> {
  // This function can be called each for time slot group (max 3 times, MOR, DAY, EVE)
  // The SIPPY WAREHOUSE is the default origin and destination
  // The resident requests will be the waypoints

  function getUTCStartTime(): string {
    // The goal here is to get data based on LA times so we can take advantage of the traffic data
    const appointmentDateTime = dayjs(forDate);

    const laUTCAppointmentTime = appointmentDateTime
      .set("hour", getTimeSlotHours(timeSlot)[0])
      .tz("America/Los_Angeles")
      .utc()
      .toISOString();
    return laUTCAppointmentTime;
  }

  const waypoints = groupedLatLongs.map((latLng) => ({
    vehicleStopover: true,
    location: {
      latLng: {
        latitude: latLng.latitude,
        longitude: latLng.longitude,
      },
    },
  }));

  const body = {
    origin: {
      location: {
        latLng: {
          latitude: SIPPY_WAREHOUSE.latitude,
          longitude: SIPPY_WAREHOUSE.longitude,
        },
      },
    },
    destination: {
      location: {
        latLng: {
          latitude: SIPPY_WAREHOUSE.latitude,
          longitude: SIPPY_WAREHOUSE.longitude,
        },
      },
    },
    travelMode: "DRIVE",
    routingPreference: "TRAFFIC_AWARE",
    departureTime: getUTCStartTime(),
    intermediates: [...waypoints],
  };

  const headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": process.env.GOOGLEMAPS_API_KEY!,
    "X-Goog-FieldMask":
      "routes.legs.distanceMeters,routes.legs.duration,routes.legs.polyline,routes.legs.startLocation,routes.legs.endLocation",
  };

  const response = await fetch(GOOGLE_ROUTES_API, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const data = await response.json();
    return {
      legs: [...data.routes[0].legs],
    };
  }
  throw new Error("Failed to fetch google route data");
}
