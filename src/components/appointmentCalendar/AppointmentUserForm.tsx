'use client'

import React, { useState } from "react";
import { z } from "zod";
import { ButtonText } from "../buttonText";
import { InputText } from "../inputText";
import { TextLabel } from "../textLabel";
import { WrapperContainer } from "../wrapperConteiner";

const formSchema = z.object({
  userName: z.string().min(3, { message: 'Name must be at least 2 characters long' }).transform(name => name.toLowerCase()),
  fullName: z.string().min(3, { message: 'Name must be at least 2 characters long' }).transform(name => name.toLowerCase())

});

type FormSchemaUserFormData = z.infer<typeof formSchema>;

export function AppointmentUserForm() {
  const [formData, setFormData] = useState<FormSchemaUserFormData>({ userName: '', fullName: '' });
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = formSchema.safeParse(formData);

    if (!result.success) {
      setError(result.error.errors[0]?.message); // Set error message
      return;
    }

    console.log(result.data.userName, result.data.fullName); // Valid data here
    setError(null); // Clear errors
  }

  return (
    <div className="flex flex-1 justify-center items-center">
      
      <form
        onSubmit={handleSubmit}
        className="flex p-6 w-[510px] flex-col gap-4 bg-simmpy-gray-600 rounded-md"
      >
        <WrapperContainer>
          <TextLabel text="Name" fontSize="Text-18" color="Gray-100" />
          <InputText 
            text="userName"
            value={formData.userName}
            onChange={(event) => setFormData({ ...formData, userName: event.target.value })}
            error={error ?? ''}
            preFix
          />

          <TextLabel text="fullName" fontSize="Text-18" color="Gray-100" />
          <InputText 
            text="fullName"
            value={formData.fullName}
            onChange={(event) => setFormData({ ...formData, fullName: event.target.value })}
            error={error ?? ''}
          />
        </WrapperContainer> 

        <ButtonText text="Next" color="Green" />
      </form>
    </div>
  );
}
