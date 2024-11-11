import { ButtonText } from "../buttonText"
import { InputText } from "../inputText"
import { TextLabel } from "../textLabel"

export function AppointmentUserForm() {

  return (
    <div className="flex flex-1 justify-center items-center">
      <form 
        className="flex p-6 w-[510px] flex-col gap-4 bg-simmpy-gray-600 rounded-md"
      >
        <TextLabel text="Name" fontSize="Text-18" color="Gray-200"/>
        <InputText text="Name"/>

        <ButtonText text="Next"/>
      </form>
    </div>
  )
}