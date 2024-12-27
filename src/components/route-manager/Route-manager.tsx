"use client";

import { googleMapsLoader } from "@/components/route-manager/utils/google-maps-loader";
import Spinner from "@/components/spinner/Spinner";

import { ResidentRequestService } from "@/services/resident-request-service";
import { OptimizedResidentRequestData } from "@/types/optimized-resident-request-data";
import { TimeSlot } from "@/types/time-slot";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RouteList from "./Route-list";
import { renderDirectionsOnMap } from "./helpers/route-manager-helpers";

interface RouteManagerProps {
  dateValue: string;
}

const BASE_LOS_ANGELES_COORDINATES = { lat: 34.0522, lng: -118.2437 };

export default function RouteManager({ dateValue }: RouteManagerProps) {
  const { data: session, status } = useSession();
  const webRouter = useRouter();
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [optimizedRequestData, setOptimizedRequestData] =
    useState<OptimizedResidentRequestData>({});

  useEffect(() => {
    if (status === "unauthenticated") {
      webRouter.replace("/authenticate");
    }
  }, [status, webRouter]);

  const fetchOptimizedRoutes = async () => {
    try {
      setIsBusy(true);
      const formattedDate = dayjs(dateValue.toString()).format("YYYY-MM-DD");
      const optimizedResults =
        await ResidentRequestService.fetchOptimizedResidentRequestsByDate(
          formattedDate
        );

      if (Object.keys(optimizedResults).length === 0) {
        console.warn("No routes found for the selected date.");
        return;
      }

      setOptimizedRequestData(optimizedResults);

      if (googleMap) {
        const directionsService = new google.maps.DirectionsService();

        // Render the optimized routes as waypoints and directions on the map
        for (const [timeslot, routeData] of Object.entries(optimizedResults)) {
          if (routeData) {
            renderDirectionsOnMap({
              timeslot: timeslot as TimeSlot,
              directionService: directionsService,
              routeLegs: routeData.legs,
              googleMap,
            });
          }
        }

        setIsBusy(false);
      }
    } catch (error) {
      setIsBusy(false);
      console.error(
        "Error handling fetching daily optimized requests:",
        (error as Error).message
      );
      setFetchError(
        "Unable to complete optimization due to an error. Please check the date and try again."
      );
    }
  };

  useEffect(() => {
    async function initMap() {
      const mapElement = document.getElementById("gmap") as HTMLElement;
      if (!mapElement) return;

      await googleMapsLoader.load();

      const map = new google.maps.Map(mapElement, {
        center: {
          lat: BASE_LOS_ANGELES_COORDINATES.lat,
          lng: BASE_LOS_ANGELES_COORDINATES.lng,
        },
        zoom: 10,
      });

      setGoogleMap(map);
    }

    initMap();
  }, []);

  if (!session?.user?.isAdmin)
    return (
      <div>
        <p className="text-simmpy-red">Not authorized</p>
      </div>
    );

  return (
    <div className="p-2">
      <div>
        <h2 className="text-3xl font-bold text-center">
          Route Optimization for{" "}
          {dayjs(dateValue.toString()).format("MMM-DD-YYYY")}
        </h2>
      </div>
      <div className="my-4">
        <div>
          <div className="my-6 md:flex md:justify-center">
            <button
              onClick={fetchOptimizedRoutes}
              className="bg-simmpy-blue py-2 rounded-md w-full md:w-1/2"
              disabled={isBusy}
            >
              <div className="flex justify-center">
                {isBusy && <Spinner size="sm" />}
                <p className="text-white text-sm ml-2">
                  Generate Optimized Route
                </p>
              </div>
            </button>
          </div>
        </div>
        {fetchError && (
          <p className="text-simmpy-red text-center">{fetchError}</p>
        )}
      </div>
      <div className="flex flex-wrap w-full md:justify-around">
        <RouteList optimizedRouteData={optimizedRequestData} />
        {/* Pass routes as props */}
        <div className="h-[300px] w-[500px] md:w-[600px]" id="gmap"></div>
      </div>
    </div>
  );
}
