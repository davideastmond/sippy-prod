'use client'

import React, { useState } from "react";
import { z } from "zod";
import { ButtonText } from "../buttonText";
import { InputText } from "../inputText";
import { TextLabel } from "../textLabel";
import { WrapperContainer } from "../wrapperConteiner";
import { HeaderStatus } from "./AppointmentHeaderStatus";

const formSchema = z.object({
  userName: z.string()
    .min(3, { message: 'Your username must be at least 3 characters long' })
    .transform(name => name.toLowerCase()),
  fullName: z.string()
    .min(3, { message: 'Name must be at least 3 characters long' })
    .transform(name => name.toLowerCase())
});

type FormSchemaUserFormData = z.infer<typeof formSchema>;

export function AppointmentUserForm() {
  const [formData, setFormData] = useState<FormSchemaUserFormData>({ userName: '', fullName: '' });
  const [errors, setErrors] = useState<{ userName?: string; fullName?: string }>({});

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = formSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: { userName?: string; fullName?: string } = {};
      result.error.errors.forEach(err => {
        fieldErrors[err.path[0] as keyof FormSchemaUserFormData] = err.message;
      });
      setErrors(fieldErrors);
    } else {
      console.log(result.data.userName, result.data.fullName); // Valid data
      setErrors({});
    }
  }

  return (
    <div className="flex w-[540px] gap-2 flex-col flex-1 justify-center items-center">
      <HeaderStatus currentStage={0} stages={['1', '2', '3', '4']}/>
      <form
        onSubmit={handleSubmit}
        className="flex p-6 w-full flex-col gap-4 bg-simmpy-gray-600 rounded-md"
      >
        <WrapperContainer>
          <TextLabel text="Username" fontSize="Text-18" color="Gray-100" />
          <InputText 
            text="userName"
            value={formData.userName}
            onChange={(event) => setFormData({ ...formData, userName: event.target.value })}
            error={errors.userName}
            preFix
          />

          <TextLabel text="Full Name" fontSize="Text-18" color="Gray-100" />
          <InputText 
            text="fullName"
            value={formData.fullName}
            onChange={(event) => setFormData({ ...formData, fullName: event.target.value })}
            error={errors.fullName}
          />
        </WrapperContainer> 

        <ButtonText text="Next" color="Green" />
      </form>
    </div>
  );
}
