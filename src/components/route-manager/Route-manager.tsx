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
import { ResidentRequestCollation } from "@/types/resident-request-collation";

export default function RouteManager() {
  const { data: session, status } = useSession();
  const webRouter = useRouter();
  const [dateValue, setDateValue] = useState(parseDate(dayjs().format("YYYY-MM-DD")));
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);
  const [filteredRequests, setFilteredRequests] = useState<ResidentRequestCollation[]>([]);

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

      setFilteredRequests(result); // Pass filtered data to RouteList

      if (result.length > 0 && googleMap) {
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer({ map: googleMap });

        // Set the starting point, ending point, and waypoints
        const waypoints = result.slice(1, -1).map((request) => ({
          location: {
            lat: request.address.latitude,
            lng: request.address.longitude,
          },
          stopover: true,
        }));

        const routeRequest: google.maps.DirectionsRequest = {
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

        directionsService.route(routeRequest, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
          } else {
            console.error("Error generating directions:", status);
          }
        });
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
    <>
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
            <RouteList routes={filteredRequests} /> {/* Pass routes as props */}
            <div className="h-[300px] w-[500px]" id="gmap"></div>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-simmpy-red">Not authorized</h1>
        </div>
      )}
    </>
  );
}
