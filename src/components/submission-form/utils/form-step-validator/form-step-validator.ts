import {
  addressSchema,
  appointmentSchema,
  nameEmailPhoneSchema,
} from "../../definitions/form-schemas";

/* 
  Since the form is split into steps, we need to validate the form data based on the current step.
  This function returns the appropriate schema for the current step.
*/
export const FormStepValidator = (stepIdx: number) => {
  const rules = [
    {
      validator: nameEmailPhoneSchema,
    },
    {
      validator: addressSchema,
    },
    {
      validator: appointmentSchema,
    },
  ];
  return rules[stepIdx].validator;
};
