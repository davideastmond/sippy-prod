import { InputText } from "@/components/inputText";
import { TextLabel } from "@/components/textLabel";
import { FormSchemaUserFormData } from "../definitions/types";

/* 
  name, e-mail and phone number are collected here
*/
interface FormStepOneProps {
  formData: Partial<FormSchemaUserFormData>;
  setFormData: { (data: Partial<FormSchemaUserFormData>): void };
  errors: {
    email?: string;
    name?: string;
    areaCode?: string;
    phoneNumber?: string;
  };
}
export const FormStepOne = ({
  formData,
  setFormData,
  errors,
}: FormStepOneProps) => {
  return (
    <>
      <TextLabel text="E-mail Address" fontSize="Text-18" color="Gray-100" />
      {/* The e-mail field should be pre-populated with oAuth data */}
      <InputText
        text="E-mail Address"
        value={formData.email!}
        disalbed
        onChange={(event) =>
          setFormData({ ...formData, email: event.target.value })
        }
        error={errors.email}
      />

      <TextLabel text="Full Name" fontSize="Text-18" color="Gray-100" />
      <InputText
        text="Full Name"
        value={formData.name!}
        onChange={(event) =>
          setFormData({ ...formData, name: event.target.value })
        }
        error={errors.name}
      />
      <TextLabel text="Phone number" fontSize="Text-18" color="Gray-100" />
      <div className="flex gap-x-2">
        <InputText
          text="Area code"
          value={formData.areaCode?.toString()!}
          maxLength={3}
          onChange={(event) =>
            setFormData({
              ...formData,
              areaCode: parseInt(event.target.value, 10) || 213,
            })
          }
          error={errors.areaCode}
        />

        <InputText
          text="Phone number"
          value={formData.phoneNumber?.toString()!}
          maxLength={7}
          onChange={(event) =>
            setFormData({
              ...formData,
              phoneNumber: parseInt(event.target.value, 10) || 0,
            })
          }
          error={errors.phoneNumber}
        />
      </div>
    </>
  );
};
