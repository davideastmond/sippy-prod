/* Confirm and submit screen */

import { TextLabel } from "@/components/textLabel";
import { FormSchemaUserFormData } from "../definitions/types";

interface ReviewSubmitProps {
  formData: Partial<FormSchemaUserFormData>;
}
export const ReviewSubmit = ({ formData }: ReviewSubmitProps) => {
  return (
    <>
      <TextLabel text="Review and Submit" fontSize="Text-18" color="Gray-100" />
    </>
  );
};
