"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { ButtonText } from "../buttonText";
import { WrapperContainer } from "../wrapperContainer";
import { HeaderStatus } from "./AppointmentHeaderStatus";
import { FormStepOne } from "./steps/FormStepOne";

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .transform((name) => name.toLowerCase()),
  email: z.string().email({ message: "Invalid email address" }),
});

type FormSchemaUserFormData = z.infer<typeof formSchema>;

export function SubmissionForm() {
  const [formData, setFormData] = useState<FormSchemaUserFormData>({
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    name?: string;
  }>({});

  const [currentStep, setCurrentStep] = useState(0);

  const { data: session, status } = useSession();
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = formSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: { email?: string; name?: string } = {};
      for (const err of result.error.errors) {
        fieldErrors[err.path[0] as keyof FormSchemaUserFormData] = err.message;
      }
      setErrors(fieldErrors);
    }
    setErrors({});
    // Save to state or localStorage
    // Progress to the next step
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

  // Grab the user's email from the session user
  useEffect(() => {
    if (session?.user?.email) {
      setFormData({ ...formData, email: session.user.email });
    }
  }, [session?.user]);

  if (status === "unauthenticated") {
    router.replace("/signup");
    return null;
  }

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
