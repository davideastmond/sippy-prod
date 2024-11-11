

interface InputTextProps {
  text: string
}

export function InputText({ text }: InputTextProps ) {
  return (
    <input 
      placeholder={text}
      className="w-full h-12 py-2 px-4 bg-simmpy-gray-800 font-lato text-lg rounded-md placeholder:text-simmpy-gray-200 text-white"
    />
  )
}