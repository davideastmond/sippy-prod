import { generatePdf } from "@/lib/pdf-generator/pdf-generator";
import { formatTime } from "@/lib/utils/date-time-formatters/format-time";
import { ResidentRequestDataBaseResponseWithDuration } from "@/types/database-query-results/resident-request-database-response";
import { OptimizedResidentRequestData } from "@/types/optimized-resident-request-data";
import { TimeSlot } from "@/types/time-slot";
import { RequestStatus } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { TIMESLOT_MAP_RENDER_DICT } from "./helpers/route-manager-helpers";

interface RouteListProps {
  optimizedRouteData?: OptimizedResidentRequestData; // Mark as optional to allow default value
  onTimeSlotToggle?: (timeSlot: TimeSlot, checked: boolean) => void;
  date: string;
  onActionClicked?: (
    statusAction: RequestStatus,
    requestId: string,
    timeSlot: TimeSlot
  ) => void;
  isBusy?: boolean;
}

export default function RouteList({
  optimizedRouteData,
  onTimeSlotToggle,
  onActionClicked,
  isBusy,
  date,
}: RouteListProps) {
  const [checkedOptions, setCheckedOptions] = useState<
    Record<TimeSlot, boolean>
  >({
    [TimeSlot.Morning]: true,
    [TimeSlot.Daytime]: true,
    [TimeSlot.Evening]: true,
  });

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const timeSlot = name as TimeSlot;
    setCheckedOptions((prev) => ({ ...prev, [timeSlot]: checked }));
    onTimeSlotToggle?.(timeSlot, checked);
  };

  if (Object.keys(optimizedRouteData as object)?.length === 0) {
    return null;
  }

  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true);
    await generatePdf(date, optimizedRouteData!);
    setIsGeneratingPdf(false);
  };

  return (
    <div className="mt-4 w-full md:w-1/2">
      <div className="flex items-center justify-between">
        <header className="text-lg font-medium text-gray-900">Routes</header>
        <button onClick={handleGeneratePdf} disabled={isGeneratingPdf}>
          <div className="flex items-center space-x-2 hover:bg-gray-300 p-2 rounded-lg">
            <Image
              src="/assets/images/icons/pdf.svg"
              alt="Generate"
              width={16}
              height={16}
            />
            <p className="text-sm">Generate PDF</p>
          </div>
        </button>
      </div>
      <div className="mt-4">
        {optimizedRouteData?.MOR && (
          <div className="mt-4">
            <h3
              className={`text-sm font-medium text-gray-900 p-2 rounded-lg ${TIMESLOT_MAP_RENDER_DICT["MOR"].bgColor} flex justify-between`}
            >
              Morning
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                name={TimeSlot.Morning}
                onChange={handleToggle}
                checked={checkedOptions[TimeSlot.Morning]}
              />
            </h3>

            <OptmizedList
              waypoints={optimizedRouteData.MOR.waypoints}
              onActionClicked={onActionClicked}
              timeSlot={TimeSlot.Morning}
              isBusy={isBusy}
            />
          </div>
        )}
        {optimizedRouteData?.DAY && (
          <div className="mt-4">
            <h3
              className={`text-sm font-medium text-gray-900 p-2 rounded-lg ${TIMESLOT_MAP_RENDER_DICT["DAY"].bgColor} flex justify-between`}
            >
              Daytime
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                name={TimeSlot.Daytime}
                onChange={handleToggle}
                checked={checkedOptions[TimeSlot.Daytime]}
              />
            </h3>
            <OptmizedList
              waypoints={optimizedRouteData.DAY.waypoints}
              onActionClicked={onActionClicked}
              timeSlot={TimeSlot.Daytime}
              isBusy={isBusy}
            />
          </div>
        )}
        {optimizedRouteData?.EVE && (
          <div className="mt-4">
            <h3
              className={`text-sm font-medium text-gray-900 p-2 rounded-lg ${TIMESLOT_MAP_RENDER_DICT["EVE"].bgColor} flex justify-between`}
            >
              Evening
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                name={TimeSlot.Evening}
                onChange={handleToggle}
                checked={checkedOptions[TimeSlot.Evening]}
              />
            </h3>
            <OptmizedList
              waypoints={optimizedRouteData.EVE.waypoints}
              onActionClicked={onActionClicked}
              timeSlot={TimeSlot.Evening}
              isBusy={isBusy}
            />
          </div>
        )}
      </div>
    </div>
  );
}

const OptmizedList = ({
  waypoints,
  onActionClicked,
  timeSlot,
  isBusy,
}: {
  waypoints: ResidentRequestDataBaseResponseWithDuration[];
  isBusy?: boolean;
  onActionClicked?: (
    statusAction: RequestStatus,
    requestId: string,
    timeSlot: TimeSlot
  ) => void;
  timeSlot: TimeSlot;
}) => {
  if (waypoints.length === 0) {
    return (
      <ul>
        <li className="pb-3 sm:pb-4 rounded-md p-4 text-center">
          <p className="text-sm text-gray-500">No routes available.</p>
        </li>
      </ul>
    );
  }
  return (
    <ul className="max-w-md divide-y divide-gray-200 mt-4">
      {waypoints.map((residentRequest) => (
        <li
          key={residentRequest.id}
          className="pb-3 sm:pb-4 p-4 shadow-lg shadow-slate-50/70"
        >
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {residentRequest.applicantName || residentRequest.user.name}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {`${residentRequest.address!.streetNumber} ${
                  residentRequest.address!.streetName
                }, ${residentRequest.address!.city}`}
              </p>
              <p className="text-sm text-gray-500 truncate">
                <b>Est. Appointment Time: </b>{" "}
                {formatTime(residentRequest.assignedTimeSlot!.startTime!) ||
                  "N/A"}
              </p>
              <p className="text-sm text-gray-500 truncate">
                Status: {residentRequest.status}
              </p>
            </div>
          </div>
          <div>
            {residentRequest.status === RequestStatus.PENDING && (
              // Remember the status is what we want to change it TO
              <RouteListActionButton
                status={RequestStatus.COMPLETED}
                requestId={residentRequest.id}
                onActionClicked={onActionClicked}
                timeSlot={timeSlot}
                disabled={isBusy}
              />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

const RouteListActionButton = ({
  onActionClicked,
  status,
  requestId,
  timeSlot,
  disabled,
}: {
  onActionClicked?: (
    statusAction: RequestStatus,
    requestId: string,
    timeSlot: TimeSlot
  ) => void;
  status: RequestStatus;
  requestId: string;
  timeSlot: TimeSlot;
  disabled?: boolean;
}) => {
  return (
    <button
      className="text-sm bg-simmpy-green text-simmpy-gray-100 px-4 rounded-lg"
      onClick={() => onActionClicked?.(status, requestId, timeSlot)}
      disabled={disabled}
    >
      {`Mark ${status.slice(0, 1).toUpperCase()}${status
        .slice(1)
        .toLowerCase()}`}
    </button>
  );
};
