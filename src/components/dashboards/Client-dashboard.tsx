"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "@/components/spinner/Spinner";
import { ResidentRequestService } from "app/services/resident-request-service";
import "react-toastify/dist/ReactToastify.css";

import { UserResidentRequestsApiResponse } from "@/types/api-responses/user-resident-requests-api-response";

type ResidentRequest = UserResidentRequestsApiResponse["requests"][number];

const statusToColorMap: Record<
  string,
  { border: string; bg: string; text: string }
> = {
  COMPLETED: {
    border: "border-green-500",
    bg: "bg-green-50",
    text: "text-green-600",
  },
  PENDING: {
    border: "border-yellow-500",
    bg: "bg-yellow-50",
    text: "text-yellow-600",
  },
  CANCELED: {
    border: "border-red-500",
    bg: "bg-red-50",
    text: "text-red-600",
  },
};

const formatTime = (time: string | Date) => {
  const date = typeof time === "string" ? new Date(time) : time;
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

const formatDate = (dateString: string | Date) => {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [requestsForUser, setRequestsForUser] = useState<ResidentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] =
    useState<ResidentRequest | null>(null);
  const prevRequestsRef = useRef<ResidentRequest[]>([]);
  const isFetchingRef = useRef(false);
  const [isModalClosing, setIsModalClosing] = useState(false);

  const handleCloseModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setSelectedRequest(null);
      setIsModalClosing(false);
    }, 300);
  };

  const detectStatusChanges = useCallback(
    (prevRequests: ResidentRequest[], currentRequests: ResidentRequest[]) => {
      currentRequests.forEach((currentRequest) => {
        const prevRequest = prevRequests.find(
          (req) => req.id === currentRequest.id
        );

        if (!prevRequest || prevRequest.status === currentRequest.status) {
          return;
        }

        const addressInfo = currentRequest.address
          ? `${currentRequest.address.city}, ${currentRequest.address.streetName}`
          : "Unknown Address";

        if (currentRequest.status === "COMPLETED") {
          toast.success(`Request at ${addressInfo} is completed!`);
        } else if (currentRequest.status === "PENDING") {
          toast.warn(`Request at ${addressInfo} is now pending.`);
        } else if (currentRequest.status === "CANCELED") {
          toast.error(`Request at ${addressInfo} has been canceled.`);
        }
      });
    },
    []
  );

  const fetchResidentRequestsForUser = useCallback(
    async (isPolling = false) => {
      if (
        !session ||
        !session.user?.id ||
        session.user.isAdmin ||
        isFetchingRef.current
      ) {
        return;
      }

      isFetchingRef.current = true;

      try {
        const res =
          await ResidentRequestService.getResidentRequestsByAuthenticatedUser(
            session.user.id
          );

        const sortedRequests = res.requests.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        if (prevRequestsRef.current) {
          detectStatusChanges(prevRequestsRef.current, sortedRequests);
        }

        prevRequestsRef.current = sortedRequests;
        setRequestsForUser(sortedRequests);
      } catch (error) {
        console.error("Error fetching resident requests:", error);
        if (!isPolling) {
          toast.error("Failed to fetch requests. Please try again.");
        }
      } finally {
        isFetchingRef.current = false;
        setIsLoading(false);
      }
    },
    [session, detectStatusChanges]
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/authenticate");
    } else if (session?.user?.isAdmin) {
      router.replace("/dashboard/admin");
    } else {
      router.replace("/dashboard");
    }
  }, [status, session?.user?.isAdmin, router]);

  useEffect(() => {
    if (!session?.user?.id || session?.user?.isAdmin) return;

    fetchResidentRequestsForUser();

    const interval = setInterval(() => {
      fetchResidentRequestsForUser(true);
    }, 3000);

    return () => clearInterval(interval);
  }, [session?.user?.id, session?.user?.isAdmin, fetchResidentRequestsForUser]);

  const handleCancelPendingRequest = async (requestId: string) => {
    try {
      await ResidentRequestService.patchRequestStatusById(
        requestId,
        "CANCELED"
      );
      toast.error("Request successfully canceled.");
      await fetchResidentRequestsForUser();
      setSelectedRequest(null);
    } catch (error) {
      toast.error("Failed to cancel request. Please try again.");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Spinner />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-100 py-10"
      style={{ minHeight: "calc(100vh - 72px)" }} //Navbar
    >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">My Requests</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requestsForUser.map((request) => (
            <div
              key={request.id}
              className={`rounded-lg shadow-lg p-6 hover:shadow-xl transition relative flex flex-col border-4 cursor-pointer ${
                statusToColorMap[request.status].border
              } ${statusToColorMap[request.status].bg}`}
              onClick={() => setSelectedRequest(request)}
            >
              <div className="flex justify-between w-full mb-4">
                <p className="text-gray-600 font-medium">
                  {formatDate(request.requestedTimeSlot.startTime)}
                </p>
                <p className="text-gray-600 font-medium">
                  {formatTime(request.requestedTimeSlot.startTime)} -{" "}
                  {formatTime(request.requestedTimeSlot.endTime)}
                </p>
              </div>
              <p className="text-gray-700 mb-2">
                {request.address?.city || "Unknown City"},{" "}
                {request.address?.streetName || "Unknown Street"}
              </p>
              <h2
                className={`text-2xl font-bold uppercase ${
                  statusToColorMap[request.status].text
                }`}
              >
                {request.status}
              </h2>
            </div>
          ))}
        </div>
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl border-t-8 ${
              statusToColorMap[selectedRequest.status].border
            } ${isModalClosing ? "animate-shrink" : "animate-grow"}`}
          >
            <h2
              className={`text-3xl font-bold mb-6 ${
                statusToColorMap[selectedRequest.status].text
              }`}
            >
              {selectedRequest.status} Details
            </h2>
            <div className="space-y-4">
              <p className="text-lg">
                <strong>Address:</strong>{" "}
                {selectedRequest.address?.streetNumber || "Unknown"}{" "}
                {selectedRequest.address?.streetName || "Unknown"},{" "}
                {selectedRequest.address?.city || "Unknown"}
              </p>
              <p className="text-lg">
                <strong>Requested Time Slot:</strong>{" "}
                {formatTime(selectedRequest.requestedTimeSlot.startTime)} -{" "}
                {formatTime(selectedRequest.requestedTimeSlot.endTime)}
              </p>
            </div>
            <div className="flex justify-between gap-4 mt-6">
              {selectedRequest.status === "PENDING" && (
                <button
                  className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition"
                  onClick={() => handleCancelPendingRequest(selectedRequest.id)}
                >
                  Cancel Request
                </button>
              )}
              <button
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg shadow-md hover:bg-gray-400 transition ml-auto"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
