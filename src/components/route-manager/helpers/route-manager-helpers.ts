import { GoogleRouteLeg } from "@/lib/utils/google-routes/google-routes";
import { TimeSlot } from "@/types/time-slot";

function getWaypointsForTimeslot(
  routeData: GoogleRouteLeg[]
): { location: { lat: number; lng: number }; stopover: boolean }[] {
  return routeData.slice(1).map((segment) => ({
    location: {
      lat: segment.startLocation.latLng.latitude,
      lng: segment.startLocation.latLng.longitude,
    },
    stopover: true,
  }));
}

export function renderDirectionsOnMap({
  timeslot,
  directionService,
  routeLegs,
  googleMap,
}: {
  routeLegs: GoogleRouteLeg[];
  timeslot: TimeSlot;
  directionService: google.maps.DirectionsService;
  googleMap: google.maps.Map;
}) {
  const directionsRequest: google.maps.DirectionsRequest = {
    origin: {
      lat:
        routeLegs[0].startLocation.latLng.latitude -
        TIMESLOT_MAP_RENDER_DICT[timeslot].offSet,
      lng:
        routeLegs[0].startLocation.latLng.longitude -
        TIMESLOT_MAP_RENDER_DICT[timeslot].offSet,
    },
    destination: {
      lat:
        routeLegs[routeLegs.length - 1].endLocation.latLng.latitude +
        TIMESLOT_MAP_RENDER_DICT[timeslot].offSet,
      lng:
        routeLegs[routeLegs.length - 1].endLocation.latLng.longitude +
        TIMESLOT_MAP_RENDER_DICT[timeslot].offSet,
    },
    waypoints: getWaypointsForTimeslot(routeLegs),
    travelMode: google.maps.TravelMode.DRIVING,
  };

  directionService.route(directionsRequest, (result, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      const directionsRenderer = new google.maps.DirectionsRenderer({
        map: googleMap,
        polylineOptions: {
          strokeColor: TIMESLOT_MAP_RENDER_DICT[timeslot].strokeColor,
          strokeOpacity: 0.7,
          strokeWeight: 5,
        },
      });

      directionsRenderer.setDirections(result);
    } else {
      console.error("Error rendering directions for timeslot: ", timeslot);
    }
  });
}

export const TIMESLOT_MAP_RENDER_DICT: Record<
  TimeSlot,
  { strokeColor: string; offSet: number; bgColor: string }
> = {
  // Offset is used to prevent overlapping of waypoint markers, particularly for the first and last waypoints
  MOR: {
    strokeColor: "#FFD700",
    offSet: 0.0001,
    bgColor: "bg-[#FFD700]/60",
  },
  DAY: { strokeColor: "#3CB371", offSet: 0.0002, bgColor: "bg-[#3CB371]/60" },
  EVE: { strokeColor: "#4169E1", offSet: 0.0003, bgColor: "bg-[#4169E1]/60" },
};
