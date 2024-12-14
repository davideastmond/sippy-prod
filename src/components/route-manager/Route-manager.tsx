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
// import { ResidentRequestCollation } from "@/types/resident-request-collation";

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
        const firstRequest = result[0];
        const center = {
          lat: firstRequest.address.latitude,
          lng: firstRequest.address.longitude,
        };

        googleMap.setCenter(center);

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
        center: { lat: 0, lng: 0 },
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
    </>
  );
}
