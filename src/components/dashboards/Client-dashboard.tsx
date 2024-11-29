"use client";
import { ResidentRequestService } from "app/services/resident-request-service";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

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
      const res =
        await ResidentRequestService.getResidentRequestsByAuthenticatedUser(
          session?.user?.id!
        );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signup");
    }
  }, [status]);

  return (
    <>
      <div>
        <h1>Client Dashboard</h1>
      </div>
      <h1>Welcome, {session?.user?.name} </h1>
      <div className="mt-6">
        <table>
          <thead>
            <tr>
              <th>Address</th>
              <th>Requested Appointment Time</th>
              <th>Confirmed ETA</th>
              <th>Status</th>
            </tr>
          </thead>
        </table>
      </div>
    </>
  );
}
