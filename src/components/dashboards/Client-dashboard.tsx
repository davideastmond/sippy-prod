"use client";
import { UserResidentRequestsApiResponse } from "@/types/api-responses/user-resident-requests-api-response";
import { RequestStatus } from "@prisma/client";
import { ResidentRequestService } from "app/services/resident-request-service";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FormattedTimeSlotDateTime from "../formatted-time-slot-date-time.tsx/FormattedTimeSlotDateTime";
import Spinner from "../spinner/Spinner";
export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [requestsForUser, setRequestsForUser] =
    useState<UserResidentRequestsApiResponse>();

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (session?.user?.isAdmin) {
      router.replace("/dashboard/admin");
    }
  }, [session?.user?.isAdmin]);

  useEffect(() => {
    // Fetch the residents requests
    if (session?.user?.id) {
      fetchResidentRequestsForUser();
    }
  }, [session?.user?.id]);

  const fetchResidentRequestsForUser = async () => {
    try {
      setIsLoading(true);
      const res =
        await ResidentRequestService.getResidentRequestsByAuthenticatedUser(
          session!.user!.id!
        );
      setRequestsForUser(res);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signup");
    }
  }, [status]);

  if (isLoading) {
    return (
      <div className="flex justify-center mt-[10%]">
        <Spinner />
      </div>
    );
  }
  return (
    <>
      <div>
        <h1>Client Dashboard</h1>
      </div>
      <h1>Welcome, {session?.user?.name} </h1>
      <div className="relative overflow-x-auto mt-6 p-2">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3">
                Address
              </th>
              <th scope="col" className="py-3">
                Req. Appt. Time
              </th>
              <th scope="col" className="py-3">
                Confirmed ETA
              </th>
              <th scope="col" className="py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {requestsForUser?.requests.map((request) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                key={request?.id}
                onClick={() => router.push(`/resident-request/${request?.id}`)}
              >
                <td>
                  {request.address?.streetNumber} {request.address?.streetName},{" "}
                  {request.address?.city}
                </td>
                <td>
                  <FormattedTimeSlotDateTime
                    start={request.requestedTimeSlot?.startTime}
                    end={request.requestedTimeSlot?.endTime}
                  />
                </td>
                <td>
                  <FormattedTimeSlotDateTime
                    start={request.assignedTimeSlot?.startTime}
                    end={request.assignedTimeSlot?.endTime}
                  />
                </td>
                <td
                  className={`${
                    requestStatusColorMap[request.status]
                  } text-center`}
                >
                  {request.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const requestStatusColorMap = {
  [RequestStatus.CANCELED]: "bg-simmpy-red",
  [RequestStatus.COMPLETED]: "bg-simmpy-green",
  [RequestStatus.PENDING]: "bg-simmpy-yellow",
};
