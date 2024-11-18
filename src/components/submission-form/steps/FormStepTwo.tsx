import { TextLabel } from "@/components/textLabel";
import { FormSchemaUserFormData } from "../definitions/types";

interface FormStepTwoProps {
  formData: Partial<FormSchemaUserFormData>; // TODO: Define the address type
  setFormData: { (data: Partial<FormSchemaUserFormData>): void };
}
/* 
  address is collected here (auto-complete)
*/
export const FormStepTwo = ({ formData, setFormData }: FormStepTwoProps) => {
  return (
    <>
      <TextLabel text="Address" fontSize="Text-18" color="Gray-100" />
      {/* The address field should be auto-complete. It will go here */}
    </>
  );
};
