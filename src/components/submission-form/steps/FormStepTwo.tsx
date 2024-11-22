import AddressInput from "@/components/address_input/AddressInput";
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
      <TextLabel text="Service Address" fontSize="Text-18" color="Gray-100" />
      <AddressInput />
    </>
  );
};
