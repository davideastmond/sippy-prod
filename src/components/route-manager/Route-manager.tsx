"use client";

import { parseDate } from "@internationalized/date";
import { DatePicker } from "@nextui-org/react";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RouteList from "./Route-list";

export default function RouteManager() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dateValue, setDateValue] = useState(
    parseDate(dayjs().format("YYYY-MM-DD"))
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/authenticate");
    }
  }, [status, router]);

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
                <button className="bg-simmpy-blue h-[28px] px-2 rounded-md">
                  <span className="text-white text-sm">Generate Route</span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex">
            {/* List of visits on the left, google map on the right */}
            <RouteList />
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
