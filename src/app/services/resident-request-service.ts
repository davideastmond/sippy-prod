import { UserResidentRequestsApiResponse } from "@/types/api-responses/user-resident-requests-api-response";
import { ResidentReqestApiRequest } from "@/types/resident-request-api-request";
import { RequestStatus } from "@prisma/client";

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
  cancelRequestById: async (requestId: string) => {
    const response = await fetch(`/api/resident-request/${requestId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: RequestStatus.CANCELED }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete resident request");
    }

    return response.json();
  },
};
