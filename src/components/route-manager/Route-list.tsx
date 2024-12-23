import {
  OptimizedResidentRequestData,
  TimeSlotBodyData,
} from "@/types/optimized-resident-request-data";
import { TIMESLOT_MAP_RENDER_DICT } from "./helpers/route-manager-helpers";

interface RouteListProps {
  optimizedRouteData?: OptimizedResidentRequestData; // Mark as optional to allow default value
}

export default function RouteList({ optimizedRouteData }: RouteListProps) {
  return (
    <div className="mt-4 w-full md:w-1/2">
      <h2 className="text-lg font-medium text-gray-900">Routes</h2>
      <div className="mt-4">
        {optimizedRouteData?.MOR && (
          <div className="mt-4">
            <h3
              className={`text-sm font-medium text-gray-900 p-2 rounded-lg ${TIMESLOT_MAP_RENDER_DICT["MOR"].bgColor}`}
            >
              Morning
            </h3>
            {OptmizedList(optimizedRouteData.MOR)}
          </div>
        )}
        {optimizedRouteData?.DAY && (
          <div className="mt-4">
            <h3
              className={`text-sm font-medium text-gray-900 p-2 rounded-lg ${TIMESLOT_MAP_RENDER_DICT["DAY"].bgColor}`}
            >
              Daytime
            </h3>
            {OptmizedList(optimizedRouteData.DAY)}
          </div>
        )}
        {optimizedRouteData?.EVE && (
          <div className="mt-4">
            <h3
              className={`text-sm font-medium text-gray-900 p-2 rounded-lg ${TIMESLOT_MAP_RENDER_DICT["EVE"].bgColor}`}
            >
              Evening
            </h3>
            {OptmizedList(optimizedRouteData.EVE)}
          </div>
        )}
      </div>
    </div>
  );
}

const OptmizedList = (optimizedData: TimeSlotBodyData) => {
  if (optimizedData.waypoints.length === 0) {
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
      {optimizedData.waypoints.map((residentRequest) => (
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
                ETA: {residentRequest.duration || "N/A"}
              </p>
              <p className="text-sm text-gray-500 truncate">
                Status: {residentRequest.status}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
