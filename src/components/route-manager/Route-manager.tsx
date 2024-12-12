"use client";

import { parseDate } from "@internationalized/date";
import { DatePicker } from "@nextui-org/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RouteList from "./Route-list";
import { loader } from "@/services/loader";
import { generateRoutes } from "@/services/collateDailyRequests/";
import { ResidentRequestCollation } from "@/types/resident-request-collation";

export default function RouteManager() {
  const { data: session, status } = useSession();
  const webRouter = useRouter();
  const [dateValue, setDateValue] = useState(
    parseDate(dayjs().format("YYYY-MM-DD"))
  );

  const [googleMap, setGoogleMap] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      webRouter.replace("/authenticate");
    }
  }, [status, webRouter]);
/**
 * 
 */
  useEffect(() => {
    async function initMap() {
      const mapElement = document.getElementById("gmap") as HTMLElement;
      if (!mapElement) return;

      await loader.load();

      const map = new google.maps.Map(mapElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });
      setGoogleMap(map);
    }

    initMap();
  }, [googleMap]);

  const handleGenerateRoutes = async () => {
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
          },
          user: { id: "101", name: "John Doe", email: "john@example.com" },
        },
      ],
    };

    try {
      const result = await generateRoutes(requests);
      console.log("Generated Routes:", result);
    } catch (error) {
      console.error("Error generating routes:", error);
    }
  };

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
                  onClick={handleGenerateRoutes}
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
