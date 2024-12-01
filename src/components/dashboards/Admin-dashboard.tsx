"use client";

import SearchRequestsFilterPanel from "@/components/search-requests-filter-panel/Search-requests-filter-panel";
import Spinner from "@/components/spinner/Spinner";
import { formatPhoneNumber } from "@/lib/utils/phone-number/format-phone-number";
import { requestStatusColorMap } from "@/lib/utils/request-status/request-status-color-map";
import { AllUserRequestsAdminGetResponse } from "@/types/api-responses/admin-resident-requests-api-response";
import { ResidentRequestService } from "app/services/resident-request-service";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FormattedTimeSlotDateTime from "../formatted-time-slot-date-time.tsx/FormattedTimeSlotDateTime";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userRequests, setUserRequests] = useState<
    AllUserRequestsAdminGetResponse[]
  >([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signup");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.isAdmin) {
      fetchAllRequests();
    }
  }, [session?.user?.isAdmin]);

  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      const requests = await ResidentRequestService.adminGetAllRequests();
      setUserRequests(requests);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch requests");
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    const requestQuery = query.toLowerCase();
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (loading) {
    return (
      <div className="flex justify-center mt-[10%]">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {session?.user?.isAdmin ? (
        <div className="p-2">
          <h1 className="py-4">Welcome, {session?.user?.name} (Admin) </h1>
          <div>
            <h1 className="text-3xl font-bold text-center">Requests</h1>
          </div>
          <div className="mb-32">
            {/* Search and filter panel */}
            <SearchRequestsFilterPanel onSearch={handleSearch} />
          </div>
          <div className="relative overflow-x-auto mt-6 p-2 lg:flex lg:justify-center">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 bg-simmpy-gray-100 uppercase">
                <tr>
                  <th scope="col" className="py-3">
                    Name
                  </th>
                  <th scope="col" className="py-3">
                    Email
                  </th>
                  <th scope="col" className="py-3">
                    Phone#
                  </th>
                  <th scope="col" className="py-3">
                    Service Address
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
                {userRequests?.map((request) => (
                  <tr
                    className="bg-white border-b hover:cursor-pointer hover:bg-gray-50"
                    key={request?.id}
                  >
                    <td>{request.user.name}</td>
                    <td>{request.user.email}</td>
                    <td>{formatPhoneNumber(request.user.phoneNumber!)}</td>
                    <td>
                      {request.address?.streetNumber}{" "}
                      {request.address?.streetName} {request.address?.city}
                    </td>
                    <td>
                      <FormattedTimeSlotDateTime
                        start={request.requestedTimeSlot.startTime}
                        end={request.requestedTimeSlot.endTime}
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
        </div>
      ) : (
        <h1 className="text-red-500 text-center font-bold text-2xl">
          Access to this page is denied (admin)
        </h1>
      )}
    </>
  );
}
