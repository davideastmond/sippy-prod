"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RouteManager() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

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
          <div className="my-4 flex justify-center lg:justify-end">
            {/* Options menu that contains button */}
            <button
              className="text-white bg-[#1e3a89] p-2 rounded-md self-center"
              onClick={() => setModalOpen(true)}
            >
              New Optimized Route...
            </button>
          </div>
          <div className="relative overflow-x-auto mt-6 p-2 lg:flex lg:justify-center">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 bg-simmpy-gray-100 uppercase">
                <tr>
                  <th scope="col" className="py-3">
                    Date
                  </th>
                  <th scope="col" className="py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
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
