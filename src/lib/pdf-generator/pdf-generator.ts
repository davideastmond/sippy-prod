import { OptimizedResidentRequestData } from "@/types/optimized-resident-request-data";
import { TimeSlot } from "@/types/time-slot";
import { BLANK_PDF, Schema, Template } from "@pdfme/common";
import { generate } from "@pdfme/generator";
import dayjs from "dayjs";
import { formatPhoneNumber } from "../utils/phone-number/format-phone-number";
import { getTimeSlotReadableName } from "../utils/time-slot/time-slot";

const ySpacing = 5;

export async function generatePdf(
  date: string,
  optimizedData: OptimizedResidentRequestData
) {
  const { template, inputs } = createPdfContent(date, optimizedData);

  try {
    const pdfData = await generate({ template, inputs });
    const blob = new Blob([pdfData], { type: "application/pdf" });
    window.open(URL.createObjectURL(blob));
  } catch (error) {
    console.error("Failed to generate PDF", (error as Error).message);
    throw error;
  }
}

function createPdfContent(
  date: string,
  optimizedData: OptimizedResidentRequestData
): { template: Template; inputs: object[] } {
  const headerInput = {
    companyName: "Sippy Solar Panels Ltd.",
    reportDate: `Generated on ${dayjs().format("MMM DD YYYY H:mm:ss")}`,
    titleDate: `Optimized Routes for ${dayjs(date).format("MMM DD YYYY")}`,
  };

  const headerSchema = [
    {
      name: "companyName",
      type: "text",
      position: { x: 10, y: ySpacing },
      width: 100,
      height: 20,
      fontSize: 12,
    },
    {
      name: "titleDate",
      type: "text",
      position: { x: 10, y: ySpacing * 2 },
      width: 100,
      height: 10,
      fontSize: 10,
    },
    {
      name: "reportDate",
      type: "text",
      position: { x: 10, y: ySpacing * 3 },
      width: 100,
      height: 10,
      fontSize: 10,
    },
  ];

  return {
    template: {
      basePdf: BLANK_PDF,
      schemas: [[...headerSchema, ...generateSchemaBody(optimizedData)]],
    },
    inputs: [{ ...headerInput, ...generatePdfInput(optimizedData) }],
  };
}

function generateSchemaBody(
  optimizedData: OptimizedResidentRequestData
): Array<Schema> {
  const schemaBody: Schema[] = [];
  let yIndex = 20;

  for (const [timeSlot, data] of Object.entries(optimizedData)) {
    schemaBody.push({
      name: `timeSlot_${timeSlot}`,
      type: "text",
      position: { x: 10, y: (yIndex += ySpacing) },
      width: 100,
      height: 10,
      fontSize: 10,
    });

    let visitCount = 1;

    data.waypoints.forEach(() => {
      schemaBody.push(
        {
          name: `${timeSlot}_visit_${visitCount}_applicantName`,
          type: "text",
          position: { x: 20, y: (yIndex += ySpacing) },
          width: 100,
          height: 10,
          fontSize: 10,
        },
        {
          name: `${timeSlot}_visit_${visitCount}_address`,
          type: "text",
          position: { x: 20, y: (yIndex += ySpacing) },
          width: 100,
          height: 10,
          fontSize: 10,
        },
        {
          name: `${timeSlot}_visit_${visitCount}_contactPhoneNumber`,
          type: "text",
          position: { x: 20, y: (yIndex += ySpacing) },
          width: 100,
          height: 10,
          fontSize: 10,
        },
        {
          name: `${timeSlot}_visit_${visitCount}_estimatedArrivalTime`,
          type: "text",
          position: { x: 20, y: (yIndex += ySpacing) },
          width: 100,
          height: 10,
          fontSize: 10,
        }
      );
      yIndex += ySpacing;
      visitCount++;
    });
  }
  return schemaBody;
}

function generatePdfInput(
  optimizedData: OptimizedResidentRequestData
): Record<string, string> {
  const pdfInput: Record<string, string> = {};
  for (const [timeSlot, data] of Object.entries(optimizedData)) {
    // Push a section title for the time slot
    pdfInput[`timeSlot_${timeSlot}`] = getTimeSlotReadableName(
      timeSlot as TimeSlot
    );
    let visitCount = 1;
    data.waypoints.forEach((waypoint) => {
      pdfInput[
        `${timeSlot}_visit_${visitCount}_applicantName`
      ] = `Name: ${waypoint.applicantName!}`;
      pdfInput[`${timeSlot}_visit_${visitCount}_address`] = `${`Address: ${
        waypoint.address!.streetNumber
      }`} ${waypoint.address!.streetName}, ${waypoint.address!.city},  ${
        waypoint.address!.zipCode
      }`;
      pdfInput[
        `${timeSlot}_visit_${visitCount}_estimatedArrivalTime`
      ] = `ETA: ${dayjs(waypoint.assignedTimeSlot?.startTime).format("H:mm")}`;
      pdfInput[
        `${timeSlot}_visit_${visitCount}_contactPhoneNumber`
      ] = `Phone: ${formatPhoneNumber(
        waypoint.contactPhoneNumber! || waypoint.user.phoneNumber!
      )}`;
      visitCount++;
    });
  }

  return pdfInput;
}
