"use client";

import { parseDate } from "@internationalized/date";
import { DatePicker } from "@nextui-org/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RouteList from "./Route-list";
import { googleMapsLoader } from "@/services/collateDailyRequests/loader";
import { collateDailyRequests } from "@/services/collateDailyRequests/collateDailyRequests";

export default function RouteManager() {
  const { data: session, status } = useSession();
  const webRouter = useRouter();
  const [dateValue, setDateValue] = useState(parseDate(dayjs().format("YYYY-MM-DD")));
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      webRouter.replace("/authenticate");
    }
  }, [status, webRouter]);

  const handleCollateDailyRequests = async () => {
    try {
      const formattedDate = dayjs(dateValue.toString()).format("YYYY-MM-DD");
      console.log("Fetching requests for date:", formattedDate);

      const result = await collateDailyRequests(formattedDate);
      console.log("Generated Routes:", result);

      if (result.length > 0 && googleMap) {
        // Center map on the first request
        const firstRequest = result[0];
        const center = {
          lat: firstRequest.address.latitude,
          lng: firstRequest.address.longitude,
        };
        googleMap.setCenter(center);

        // Place markers for all requests
        result.forEach((request) => {
          new google.maps.Marker({
            position: {
              lat: request.address.latitude,
              lng: request.address.longitude,
            },
            map: googleMap,
            title: request.address.city,
          });
        });

        // Generate and render route if there are multiple requests
        if (result.length > 1) {
          const directionsService = new google.maps.DirectionsService();
          const directionsRenderer = new google.maps.DirectionsRenderer({ map: googleMap });

          const waypoints = result.slice(1, -1).map((request) => ({
            location: {
              lat: request.address.latitude,
              lng: request.address.longitude,
            },
            stopover: true,
          }));

          const routeRequest = {
            origin: {
              lat: result[0].address.latitude,
              lng: result[0].address.longitude,
            },
            destination: {
              lat: result[result.length - 1].address.latitude,
              lng: result[result.length - 1].address.longitude,
            },
            waypoints,
            travelMode: google.maps.TravelMode.DRIVING,
          };

          directionsService.route(routeRequest, (response, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              directionsRenderer.setDirections(response);
            } else {
              console.error("Failed to generate route:", status);
            }
          });
        }
      } else {
        console.warn("No routes found for the selected date.");
      }
    } catch (error) {
      console.error("Error generating routes:", error);
    }
  };

  useEffect(() => {
    async function initMap() {
      const mapElement = document.getElementById("gmap") as HTMLElement;
      if (!mapElement) return;

      await googleMapsLoader.load();

      const map = new google.maps.Map(mapElement, {
        center: { lat: 34.0522, lng: -118.2437 }, // Default to Los Angeles
        zoom: 10,
      });

      setGoogleMap(map);
    }

    initMap();
  }, []);

  return (
    <div>
      {session?.user?.isAdmin ? (
        <div className="p-2">
          <div>
            <h1 className="text-3xl font-bold text-center">Route Manager</h1>
          </div>
          <div className="my-4">
            <div>
              <DatePicker
                className="max-w-[284px]"
                description={"Choose a date and click 'Generate Route'"}
                value={dateValue}
                onChange={setDateValue}
              />
              <div className="mt-6">
                <button
                  onClick={handleCollateDailyRequests}
                  className="bg-simmpy-blue h-[28px] px-2 rounded-md"
                >
                  <span className="text-white text-sm">Generate Route</span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-20 flex-wrap">
            <RouteList />
            <div className="h-[300px] w-[500px]" id="gmap"></div>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-simmpy-red">Not authorized</h1>
        </div>
      )}
    </div>
  );
}
