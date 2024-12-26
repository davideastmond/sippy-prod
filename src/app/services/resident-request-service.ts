import { AllUserRequestsAdminGetResponse } from "@/types/api-responses/admin-resident-requests-api-response";
import { RequestedAvailabilityApiResponse } from "@/types/api-responses/requested-timeslot-availability-api-response.ts/requested-availability-api-response";
import { UserResidentRequestsApiResponse } from "@/types/api-responses/user-resident-requests-api-response";
import { OptimizedResidentRequestData } from "@/types/optimized-resident-request-data";
import { ResidentReqestApiRequest } from "@/types/resident-request-api-request";
import { RequestStatus } from "@prisma/client";
import dayjs from "dayjs";

type AllResidentRequestsAdminGetResponseWithCount = {
  residentRequests: AllUserRequestsAdminGetResponse[];
  count: number;
};
export const ResidentRequestService = {
  create: async (data: ResidentReqestApiRequest) => {
    const response = await fetch("/api/resident-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create resident request");
    }

    return response.json();
  },
  getResidentRequestsByAuthenticatedUser: async (
    userId: string
  ): Promise<UserResidentRequestsApiResponse> => {
    const response = await fetch(`/api/resident-request/?userId=${userId}`);

    if (!response.ok) {
      throw new Error("Failed to get resident requests");
    }

    return response.json();
  },
  patchRequestStatusById: async (requestId: string, action: RequestStatus) => {
    const response = await fetch(`/api/resident-request/${requestId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: action }),
    });

    if (!response.ok) {
      throw new Error("Failed to update resident request");
    }

    return response.json();
  },
  adminGetAllRequests: async ({
    date,
    take = 10,
    skip,
  }: {
    date: string | null;
    take: number;
    skip: number;
  }): Promise<AllResidentRequestsAdminGetResponseWithCount> => {
    const response = await fetch(
      `/api/resident-request?take=${take}&skip=${skip}&date=${date}`
    );
    const data: AllResidentRequestsAdminGetResponseWithCount =
      await response.json();

    if (!response.ok) {
      throw new Error("Failed to get all resident requests");
    }

    // Sort requests by createdAt date in descending order
    if (data) {
      return {
        residentRequests: data.residentRequests.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
        count: data.count,
      };
    }
    return { residentRequests: [], count: 0 };
  },
  getAvailableTimeSlotsByDate: async (
    date: Date
  ): Promise<RequestedAvailabilityApiResponse> => {
    const parsedDate = dayjs(date).format("YYYY-MM-DD").toString();

    const response = await fetch(
      `/api/resident-request/schedule?date=${parsedDate}`
    );
    if (!response.ok) {
      throw new Error("Failed to get available time slots");
    }
    return response.json();
  },
  fetchOptimizedResidentRequestsByDate: async (
    date: string
  ): Promise<OptimizedResidentRequestData> => {
    try {
      // Send POST request to backend with the selected date
      const response = await fetch(`/api/resident-request/optimize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date }), // Send the date to the backend
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch requests: ${response.statusText}`);
      }

      const requestAtDate: OptimizedResidentRequestData = await response.json();

      return requestAtDate;
    } catch (error) {
      console.error(
        "Error fetching or adjusting requests:",
        (error as Error).message
      );
      throw error;
    }
  },
};
