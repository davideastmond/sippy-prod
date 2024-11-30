"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import SearchRequests from "../searchRequests/SearchRequests";
import { ResidentRequest, TimeSlot, User, RequestStatus } from "@prisma/client";
import Spinner from "../spinner/Spinner";

type ExtendedResidentRequest = ResidentRequest & {
  user: User;
  requestedTimeSlot: TimeSlot;
};
export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [pendingRequests, setPendingRequests] = useState<ExtendedResidentRequest[]>([]);
  const [completedRequests, setCompletedRequests] = useState<ExtendedResidentRequest[]>([]);
  const [canceledRequests, setCanceledRequests] = useState<ExtendedResidentRequest[]>([]);
  const [filteredPending, setFilteredPending] = useState<ExtendedResidentRequest[]>([]);
  const [filteredCompleted, setFilteredCompleted] = useState<ExtendedResidentRequest[]>([]);
  const [filteredCanceled, setFilteredCanceled] = useState<ExtendedResidentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signup");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.isAdmin) {
      const fetchRequests = async (status: RequestStatus) => {
        try {
          const response = await fetch(`/api/resident-request?status=${status}`);
          const data: ExtendedResidentRequest[] = await response.json();

          // Sort requests by createdAt date in descending order
          return data.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        } catch (error) {
          console.error(`Error fetching ${status} resident requests:`, error);
          setError(`Failed to load ${status} resident requests.`);
          return [];
        }
      };

      Promise.all([
        fetchRequests(RequestStatus.PENDING),
        fetchRequests(RequestStatus.COMPLETED),
        fetchRequests(RequestStatus.CANCELED),
      ]).then(([pending, completed, canceled]) => {
        setPendingRequests(pending);
        setFilteredPending(pending);
        setCompletedRequests(completed);
        setFilteredCompleted(completed);
        setCanceledRequests(canceled);
        setFilteredCanceled(canceled);
        setLoading(false);
      });
    }
  }, [session?.user?.isAdmin]);

  const handleSearch = (query: string) => {
    const requestQuery = query.toLowerCase();

    setFilteredPending(
      pendingRequests.filter(
        (request) =>
          request.user.name.toLowerCase().includes(requestQuery) ||
          request.user.email.toLowerCase().includes(requestQuery) ||
          request.requestedTimeSlot.description?.toLowerCase().includes(requestQuery)
      )
    );
    setFilteredCompleted(
      completedRequests.filter(
        (request) =>
          request.user.name.toLowerCase().includes(requestQuery) ||
          request.user.email.toLowerCase().includes(requestQuery) ||
          request.requestedTimeSlot.description?.toLowerCase().includes(requestQuery)
      )
    );
    setFilteredCanceled(
      canceledRequests.filter(
        (request) =>
          request.user.name.toLowerCase().includes(requestQuery) ||
          request.user.email.toLowerCase().includes(requestQuery) ||
          request.requestedTimeSlot.description?.toLowerCase().includes(requestQuery)
      )
    );
  };

  const toggleRequestStatus = async (requestId: string, currentStatus: RequestStatus) => {
    let newStatus: RequestStatus;

    switch (currentStatus) {
      case RequestStatus.PENDING:
        newStatus = RequestStatus.COMPLETED;
        break;
      case RequestStatus.COMPLETED:
        newStatus = RequestStatus.PENDING;
        break;
      case RequestStatus.CANCELED:
        newStatus = RequestStatus.PENDING;
        break;
      default:
        return;
    }

    try {
      const res = await fetch(`/api/resident-request/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update request status");
      }

      // Refresh requests after update
      const updatedPending = await fetch(`/api/resident-request?status=${RequestStatus.PENDING}`).then((res) =>
        res.json()
      );
      const updatedCompleted = await fetch(`/api/resident-request?status=${RequestStatus.COMPLETED}`).then((res) =>
        res.json()
      );
      const updatedCanceled = await fetch(`/api/resident-request?status=${RequestStatus.CANCELED}`).then((res) =>
        res.json()
      );

      setPendingRequests(updatedPending);
      setFilteredPending(updatedPending);
      setCompletedRequests(updatedCompleted);
      setFilteredCompleted(updatedCompleted);
      setCanceledRequests(updatedCanceled);
      setFilteredCanceled(updatedCanceled);
    } catch (error) {
      console.error("Error updating request status:", error);
      setError("Failed to update request status.");
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (loading) {
    return <p className="text-gray-500">Loading Resident Requests...</p>;
  }
 
  if (loading) {
    return <p className="text-gray-500">Loading Resident Requests...</p>;
  }
 
  return (
    <>
      {session?.user?.isAdmin ? (
        <div className="flex flex-wrap">
          <div className="w-full md:w-2/3 p-6 bg-white rounded-lg shadow-md dark:bg-simmpy-gray-900">
            <h1 className="text-3xl font-bold text-simmpy-green">Admin Dashboard</h1>

            {/* Search Bar */}
            <SearchRequests onSearch={handleSearch} />

            {/* Pending Requests */}
            <div><h2 className="text-xl font-bold text-simmpy-gray-800 mb-4">Pending Requests</h2>
              {filteredPending.length > 0 ? (
                <ul className="mt-4 space-y-4">
                  {filteredPending.map((request) => (
                    <li key={request.id} className="p-4 bg-simmpy-gray-100 rounded-lg shadow">
                      <p>
                        User: {request.user.name} ({request.user.email})
                      </p>
                      <p>
                        Time:{" "}
                        {new Date(request.requestedTimeSlot.startTime).toLocaleTimeString()} -{" "}
                        {new Date(request.requestedTimeSlot.endTime).toLocaleTimeString()}
                      </p>
                      <button
                        onClick={() => toggleRequestStatus(request.id, request.status)}
                        className="text-simmpy-green underline"
                      >
                        Mark as Complete
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No pending requests</p>
              )}
            </div>

            {/* Completed Requests */}
            <div>
              <h2 className="text-xl font-bold text-simmpy-gray-800 mb-4">Completed Requests</h2>
              {filteredCompleted.length > 0 ? (
                <ul className="mt-4 space-y-4">
                  {filteredCompleted.map((request) => (
                    <li key={request.id} className="p-4 bg-simmpy-gray-100 rounded-lg shadow">
                      <p>
                        User: {request.user.name} ({request.user.email})
                      </p>
                      <p>
                        Time:{" "}
                        {new Date(request.requestedTimeSlot.startTime).toLocaleTimeString()} -{" "}
                        {new Date(request.requestedTimeSlot.endTime).toLocaleTimeString()}
                      </p>
                      <button
                        onClick={() => toggleRequestStatus(request.id, request.status)}
                        className="text-simmpy-yellow underline"
                      >
                        Mark as Pending
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No completed requests</p>
              )}
            </div>

            {/* Canceled Requests */}
            <h2 className="text-xl font-bold text-simmpy-gray-800 mb-4">Canceled Requests</h2>
            <div>
              {filteredCanceled.length > 0 ? (
                <ul className="mt-4 space-y-4">
                  {filteredCanceled.map((request) => (
                    <li key={request.id} className="p-4 bg-simmpy-gray-100 rounded-lg shadow">
                      <p>
                        User: {request.user.name} ({request.user.email})
                      </p>
                      <p>
                        Time:{" "}
                        {new Date(request.requestedTimeSlot.startTime).toLocaleTimeString()} -{" "}
                        {new Date(request.requestedTimeSlot.endTime).toLocaleTimeString()}
                      </p>
                      <button
                        onClick={() => toggleRequestStatus(request.id, request.status)}
                        className="text-simmpy-green underline"
                      >
                        Reopen as Pending
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No canceled requests</p>
              )}
            </div>
          </div>
          <div className="w-full md:w-1/3 p-6">
            <Image
              src="/assets/images/MapPlaceholder.png"
              alt="Map Placeholder"
              width={400}
              height={400}
              className="rounded-lg shadow-md"
            />
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