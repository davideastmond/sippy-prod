import { OptimizedResidentRequestData } from "@/types/optimized-resident-request-data";
import { BLANK_PDF, Schema, Template } from "@pdfme/common";
import { generate } from "@pdfme/generator";
import dayjs from "dayjs";

export class PDFGenerator {
  private optimizedData: OptimizedResidentRequestData;
  private date: string;
  constructor(optimizedData: OptimizedResidentRequestData, date: string) {
    this.optimizedData = optimizedData;
    this.date = date;
  }

  async generate() {
    const { template, inputs } = this.createPdfContent();

    try {
      const pdfData = await generate({ template, inputs });
      const blob = new Blob([pdfData], { type: "application/pdf" });
      window.open(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Failed to generate PDF", error);
    }
  }

  private createPdfContent(): { template: Template; inputs: object[] } {
    const headerInput = {
      titleDate: `Optimized Routes for ${dayjs(this.date).format(
        "MMM DD YYYY"
      )}`,
    };

    const headerSchema = {
      name: "titleDate",
      type: "text",
      position: { x: 10, y: 10 },
      width: 100,
      height: 10,
    };

    return {
      template: {
        basePdf: BLANK_PDF,
        schemas: [[headerSchema, ...this.generateSchemaBody()]],
      },
      inputs: [{ ...headerInput, ...this.generatePdfInput() }],
    };
  }

  private generateSchemaBody(): Array<Schema> {
    const schemaBody: Schema[] = [];
    let yIndex = 20;

    for (const [timeSlot, data] of Object.entries(this.optimizedData)) {
      schemaBody.push({
        name: `timeSlot_${timeSlot}`,
        type: "text",
        position: { x: 10, y: (yIndex += 10) },
        width: 100,
        height: 10,
      });

      let visitCount = 1;

      data.waypoints.forEach(() => {
        schemaBody.push(
          {
            name: `${timeSlot}_visit_${visitCount}_applicantName`,
            type: "text",
            position: { x: 20, y: (yIndex += 10) },
            width: 100,
            height: 10,
          },
          {
            name: `${timeSlot}_visit_${visitCount}_address`,
            type: "text",
            position: { x: 20, y: (yIndex += 10) },
            width: 100,
            height: 10,
          },
          {
            name: `${timeSlot}_visit_${visitCount}_estimatedArrivalTime`,
            type: "text",
            position: { x: 20, y: (yIndex += 10) },
            width: 100,
            height: 10,
          }
        );
        visitCount++;
      });
    }
    return schemaBody;
  }
  private generatePdfInput(): Record<string, string> {
    const pdfInput: Record<string, string> = {};
    for (const [timeSlot, data] of Object.entries(this.optimizedData)) {
      // Push a section title for the time slot
      pdfInput[`timeSlot_${timeSlot}`] = timeSlot;
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
        ] = `ETA: ${dayjs(waypoint.assignedTimeSlot?.startTime).format(
          "H:mm"
        )}`;
        visitCount++;
      });
    }

    return pdfInput;
  }
}
