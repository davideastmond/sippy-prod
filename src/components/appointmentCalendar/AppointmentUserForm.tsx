import { ButtonText } from "../buttonText"
import { InputText } from "../inputText"
import { TextLabel } from "../textLabel"
import { WrapperContainer } from "../wrapperConteiner"

export function AppointmentUserForm() {

  return (
    <div className="flex flex-1 justify-center items-center">
      <form 
        className="flex p-6 w-[510px] flex-col gap-4 bg-simmpy-gray-600 rounded-md"
      >
        <WrapperContainer>
          <TextLabel text="Name" fontSize="Text-18" color="Gray-100"/>
          <InputText text="Name"/>
        </WrapperContainer>

        <ButtonText text="Next" color="Green" />
      </form>
    </div>
  )
}