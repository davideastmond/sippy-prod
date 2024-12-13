"use client";

import { parseDate } from "@internationalized/date";
import { DatePicker } from "@nextui-org/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RouteList from "./Route-list";
import { googleMapsLoader } from "@/services/collateDailyRequests/loader";
import { generateRoutes } from "@/services/collateDailyRequests/generateRoutes";
import { ResidentRequestCollation } from "@/types/resident-request-collation";

export default function RouteManager() {
  const { data: session, status } = useSession();
  const webRouter = useRouter();
  const [dateValue, setDateValue] = useState(
    parseDate(dayjs().format("YYYY-MM-DD"))
  );
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      webRouter.replace("/authenticate");
    }
  }, [status, webRouter]);

  const handlegenerateRoutes = async () => {
    const requests: Record<string, ResidentRequestCollation[]> = {
      "2024-12-12": [
        {
          id: "1",
          requestedTimeSlot: {
            startTime: "2024-12-12T08:00:00Z",
            endTime: "2024-12-12T09:00:00Z",
          },
          address: {
            latitude: 37.7749,
            longitude: -122.4194,
            city: "San Francisco",
            streetName: "Market Street",
            streetNumber: "123",
            zipCode: "94103",
          },
          user: { id: "101", name: "John Doe", email: "john@example.com" },
        },
      ],
    };

    try {
      const result = await generateRoutes(requests);
      console.log("Generated Routes:", result);

      if (result.length > 0 && googleMap) {
        const firstRequest = result[0];
        const center = {
          lat: firstRequest.address.latitude,
          lng: firstRequest.address.longitude,
        };

        // Set map center dynamically
        googleMap.setCenter(center);

        // Add markers for each request
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
        center: { lat: 0, lng: 0 }, // Default center
        zoom: 8,
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
                  onClick={handlegenerateRoutes}
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
    </>
  );
}
