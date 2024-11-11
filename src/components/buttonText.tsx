

interface ButtonTextProps {
  text: string
  onClick?: () => void
}

export function ButtonText({ text, onClick, ...rest }: ButtonTextProps) {
  return (
    <button
      onClick={onClick}
      {...rest}
    >
      {text}
    </button>
  )
}