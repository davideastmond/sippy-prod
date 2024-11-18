import { InputText } from "@/components/inputText";
import { TextLabel } from "@/components/textLabel";

interface FormStepOneProps {
  formData: any;
  setFormData: any;
  errors: any;
}
export const FormStepOne = ({
  formData,
  setFormData,
  errors,
}: FormStepOneProps) => {
  return (
    <>
      <TextLabel text="Username" fontSize="Text-18" color="Gray-100" />
      {/* The e-mail field should be pre-populated with oAuth data */}
      <InputText
        text="E-mail Address"
        value={formData.email}
        disalbed
        onChange={(event) =>
          setFormData({ ...formData, email: event.target.value })
        }
        error={errors.userName}
        preFix
      />

      <TextLabel text="Full Name" fontSize="Text-18" color="Gray-100" />
      <InputText
        text="fullName"
        value={formData.fullName}
        onChange={(event) =>
          setFormData({ ...formData, fullName: event.target.value })
        }
        error={errors.fullName}
      />
    </>
  );
};
