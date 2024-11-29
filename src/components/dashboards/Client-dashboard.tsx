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
  }, [session?.user?.isAdmin, router]);

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

      const sortedRequests = res.requests.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
      setRequestsForUser({ ...res, requests: sortedRequests });
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/authenticate");
    }
  }, [status, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center mt-[10%]">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="p-2">
      <h1 className="py-4">Welcome, {session?.user?.name} </h1>
      <div>
        <h1 className="text-3xl font-bold text-center">My Requests</h1>
      </div>
      <div className="relative overflow-x-auto mt-6 p-2 lg:flex lg:justify-center">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 lg:max-w-[800px]">
          <thead className="text-xs text-gray-700 bg-simmpy-gray-100 uppercase">
            <tr>
              <th scope="col" className="py-3">
                Address
              </th>
              <th scope="col" className="py-3">
                Req. Time Slot
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
                className="bg-white border-b hover:cursor-pointer hover:bg-gray-50"
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
            {requestsForUser?.requests.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const requestStatusColorMap = {
  [RequestStatus.CANCELED]: "bg-simmpy-red text-simmpy-gray-100",
  [RequestStatus.COMPLETED]: "bg-simmpy-green text-simmpy-gray-100",
  [RequestStatus.PENDING]: "bg-simmpy-yellow",
};
