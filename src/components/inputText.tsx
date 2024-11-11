import { TextLabel } from "./textLabel"

interface InputTextProps {
  text: string
  value: string
  error?: string
  preFix?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function InputText({ text, value, onChange, error, preFix=false, ...rest }: InputTextProps ) {
  
  return (
    <div className="flex flex-col w-full relative items-start justify-start h-auto">
      <input 
        placeholder={text}
        className={`flex w-full h-12 py-2 px-4 bg-simmpy-gray-800 font-lato text-lg rounded-md placeholder:text-simmpy-gray-200 text-white relative
          ${preFix && 'pl-[70px]'}
        `}
        value={value}
        onChange={onChange}
        {...rest}
      />
      {preFix && 
        <div className="flex absolute mt-2.5 px-4">
          <TextLabel text="Sippy/" fontSize="Text-18" color="Gray-200"/>
        </div>
      }
      { error && <TextLabel text={error} color="Yellow" fontSize="Text-18" /> }
    </div>
  )
}