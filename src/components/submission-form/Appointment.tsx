"use client";

import Link from "next/link";

export function Appointment() {
  return (
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2/3 bg-white px-8 py-6 rounded-xl w-1/2 flex flex-col items-center max-md:relative max-md:translate-y-0 max-md:w-full max-md:px-6 max-md:py-4">
      <h2 className="text-3xl font-bold leading-10 text-neutral-700 text-center mb-4">
        Tell us your goals to save money and energy.
      </h2>
      <Link href="/resident-request/new">
        <button className="mt-4 overflow-hidden py-3.5 px-6 bg-lime-600 rounded-xl shadow-sm text-2xl font-semibold text-white hover:bg-[#228B22]">
          Make your appointment now
        </button>
      </Link>
    </div>
  );
}
