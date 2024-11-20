"use client";

import { TimeSlot } from "@/types/time-slot";
import { ResidentRequestService } from "app/services/resident-request-service";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ButtonText } from "../buttonText";
import { TextLabel } from "../textLabel";
import { WrapperContainer } from "../wrapperContainer";
import { HeaderStatus } from "./AppointmentHeaderStatus";
import { formSchema } from "./definitions/form-schema";
import { FormSchemaUserFormData } from "./definitions/types";
import { FormStepOne } from "./steps/FormStepOne";
import { FormStepThree } from "./steps/FormStepThree";
import { FormStepTwo } from "./steps/FormStepTwo";
import { ReviewSubmit } from "./steps/ReviewSubmit";

const MAX_STEPS = 4;
export function SubmissionForm() {
  const [formData, setFormData] = useState<Partial<FormSchemaUserFormData>>({
    name: "",
    email: "",
    // TODO: think about how structure the address - should it be nested or flat?
    address: {
      fullAddress: "",
    },
    appointmentDate: dayjs().add(1, "day").toDate(),
    timeSlot: TimeSlot.Morning,
    areaCode: "", // Default LA area code
    phoneNumber: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    name?: string;
  }>({});

  const [currentStep, setCurrentStep] = useState(0);

  const { data: session, status } = useSession();
  const [isBusy, setIsBusy] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: {
        email?: string;
        name?: string;
        address?: { fullAddress?: string };
        appointmentDate?: string;
        timeSlot?: string;
        areaCode?: string;
        phoneNumber?: string;
      } = {};

      for (const err of result.error.errors) {
        fieldErrors[err.path[0] as keyof FormSchemaUserFormData] = err.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    const submitterButton = (event.nativeEvent as SubmitEvent)
      ?.submitter as HTMLButtonElement;

    navigateStep(submitterButton.name as "next" | "back");
  }

  const getFormComponentByStep = (index: number): JSX.Element => {
    const steps = [
      <FormStepOne
        formData={formData}
        setFormData={setFormData}
        errors={errors}
      />,
      <FormStepTwo formData={formData} setFormData={setFormData} />,
      <FormStepThree
        formData={formData}
        setFormData={setFormData}
        errors={errors}
      />,
      <ReviewSubmit formData={formData} />,
    ];

    if (index < 0) return steps[0];
    if (index >= steps.length) return steps[steps.length - 1];

    return steps[index];
  };

  const navigateStep = async (direction: "next" | "back") => {
    if (direction === "next") {
      if (currentStep === MAX_STEPS - 1) {
        // This condition is the final submission
        await submitResidentRequest();
        setIsSubmitted(true); // Show the submission confirmation
        return;
      }
      setCurrentStep((prev) => prev + 1);
      return;
    }

    // Back condition is the assumed fall-back
    if (currentStep === 0) return;
    setCurrentStep((prev) => prev - 1);
  };

  const submitResidentRequest = async () => {
    try {
      setIsBusy(true);
      await ResidentRequestService.create(formData);
      setIsBusy(false);
    } catch (error: any) {
      console.error(error);
      setIsBusy(false);
    }
  };

  // Grab the user's email from the session user
  useEffect(() => {
    if (session?.user?.email) {
      setFormData({ ...formData, email: session.user.email });
    }
  }, [session?.user?.email]);

  if (status === "unauthenticated") {
    router.replace("/signup");
    return null;
  }

  return isSubmitted ? (
    <div className="flex p-6 w-full flex-col gap-4 bg-simmpy-gray-600 rounded-md justify-center items-center">
      <TextLabel
        text="Thank you for your submission!"
        fontSize="Text-20"
        color="Gray-100"
      />
      <TextLabel
        text="Please note that your appointment time slot is not guaranteed until you receive a confirmation email."
        fontSize="Text-14"
        color="Gray-100"
      />
      <ButtonText
        text="Return to dashboard"
        color="Green"
        onClick={() => router.push("/dashboard")}
      />
    </div>
  ) : (
    <div className="flex gap-2 flex-col flex-1 justify-center items-center">
      <HeaderStatus currentStage={currentStep} stages={[1, 2, 3, 4]} />
      <form
        onSubmit={handleSubmit}
        className="flex p-6 w-full flex-col gap-4 bg-simmpy-gray-600 rounded-md"
      >
        <WrapperContainer>
          {getFormComponentByStep(currentStep)}
        </WrapperContainer>
        {currentStep > 0 && (
          <ButtonText
            text="Back"
            color="Yellow"
            name="back"
            disabled={isBusy}
          />
        )}
        <ButtonText
          text={currentStep === 3 ? "Submit" : "Next"}
          color="Green"
          name="next"
          disabled={isBusy}
        />
      </form>
    </div>
  );
}
