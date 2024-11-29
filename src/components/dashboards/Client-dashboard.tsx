"use client";
import { ButtonText } from "@/components/buttonText";
import FormattedTimeSlotDateTime from "@/components/formatted-time-slot-date-time.tsx/FormattedTimeSlotDateTime";
import Spinner from "@/components/spinner/Spinner";
import { UserResidentRequestsApiResponse } from "@/types/api-responses/user-resident-requests-api-response";
import { RequestStatus } from "@prisma/client";
import { ResidentRequestService } from "app/services/resident-request-service";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [requestsForUser, setRequestsForUser] =
    useState<UserResidentRequestsApiResponse>();

  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [requestIdToCancel, setRequestIdToCancel] = useState<null | string>(
    null
  );
  const [apiError, setApiError] = useState<null | string>(null);
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
      setApiError("Failed to fetch requests");
      setIsLoading(false);
    }
  };

  const handleCancelPendingRequest = async (requestId: string) => {
    try {
      await ResidentRequestService.cancelRequestById(requestId);

      // Refresh the requests to update the status
      await fetchResidentRequestsForUser();
    } catch (error) {
      setApiError("Failed to cancel request");
      console.error(error);
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
              <th scope="col" className="py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {requestsForUser?.requests.map((request) => (
              <tr
                className="bg-white border-b hover:cursor-pointer hover:bg-gray-50"
                key={request?.id}
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
                <td>
                  {request.status === RequestStatus.PENDING && (
                    <button
                      className="text-simmpy-red pl-2"
                      onClick={() => {
                        setRequestIdToCancel(request.id!);
                        setModalOpen(true);
                      }}
                    >
                      Cancel
                    </button>
                  )}
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
        {apiError && (
          <div
            className="flex items-center p-4 mb-4 mt-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <svg
              className="flex-shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">There was an error.</span>
              {apiError}
            </div>
          </div>
        )}
      </div>
      {modalOpen && requestIdToCancel && (
        <CancelAppointmentModal
          onCancel={() => {
            setModalOpen(false);
            setRequestIdToCancel(null);
          }}
          onConfirm={() => {
            handleCancelPendingRequest(requestIdToCancel);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

const requestStatusColorMap = {
  [RequestStatus.CANCELED]: "bg-simmpy-red text-simmpy-gray-100",
  [RequestStatus.COMPLETED]: "bg-simmpy-green text-simmpy-gray-100",
  [RequestStatus.PENDING]: "bg-simmpy-yellow",
};

// Should we factor this out into a separate component?
const CancelAppointmentModal = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <div className="absolute w-full top-[0] h-full bg-simmpy-gray-900/60">
      <div className="modal-box w-full max-w-[800px] lg:ml-[30%] bg-simmpy-gray-600 p-4 rounded-md mt-[20vh]">
        <p className="text-simmpy-gray-100 text-center text-lg">
          Choosing cancel will cancel your pending appointment. This cannot be
          undone.
        </p>
        <p className="text-simmpy-gray-100 text-center text-lg">
          Are you sure you want to cancel your appointment?
        </p>
        <div className="flex justify-end gap-x-4 mt-4">
          <div>
            <ButtonText
              text="Yes-cancel"
              color="Red"
              paddingX={4}
              onClick={() => onConfirm()}
            />
          </div>
          <div>
            <ButtonText
              text="Go back"
              color="Green"
              paddingX={4}
              onClick={() => onCancel()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
