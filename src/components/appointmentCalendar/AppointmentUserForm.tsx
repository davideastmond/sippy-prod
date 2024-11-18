"use client";

import type React from "react";
import { useState } from "react";
import { z } from "zod";
import { ButtonText } from "../buttonText";
import { WrapperContainer } from "../wrapperConteiner";
import { HeaderStatus } from "./AppointmentHeaderStatus";
import { FormStepOne } from "./steps/FormStepOne";

const formSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .transform((name) => name.toLowerCase()),
  email: z.string().email({ message: "Invalid email address" }),
});

type FormSchemaUserFormData = z.infer<typeof formSchema>;

export function AppointmentUserForm() {
  const [formData, setFormData] = useState<FormSchemaUserFormData>({
    fullName: "",
    email: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    fullName?: string;
  }>({});

  const [currentStep, setCurrentStep] = useState(0);
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = formSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: { email?: string; fullName?: string } = {};
      for (const err of result.error.errors) {
        fieldErrors[err.path[0] as keyof FormSchemaUserFormData] = err.message;
      }
      setErrors(fieldErrors);
    } else {
      console.log(result.data.email, result.data.fullName); // Valid data
      setErrors({});
    }
  }

  const getFormStepByIndex = (index: number): JSX.Element => {
    const steps = [
      <FormStepOne
        formData={formData}
        setFormData={setFormData}
        errors={errors}
      />,
    ];
    return steps[index];
  };

  return (
    <div className="flex w-[540px] gap-2 flex-col flex-1 justify-center items-center">
      <HeaderStatus currentStage={currentStep} stages={["1", "2", "3", "4"]} />
      <form
        onSubmit={handleSubmit}
        className="flex p-6 w-full flex-col gap-4 bg-simmpy-gray-600 rounded-md"
      >
        <WrapperContainer>{getFormStepByIndex(currentStep)}</WrapperContainer>

        <ButtonText text="Next" color="Green" />
      </form>
    </div>
  );
}
