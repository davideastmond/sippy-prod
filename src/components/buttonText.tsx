interface ButtonTextProps {
  text: string;
  color: "Green" | "Yellow" | "Red";
  name?: string;
  disabled?: boolean;
  paddingX?: 2 | 4;
  onClick?: () => void;
}

export function ButtonText({
  text,
  onClick,
  color,
  name,
  disabled,
  paddingX,
  ...rest
}: ButtonTextProps) {
  return (
    <button
      className={`flex justify-center items-center font-montserrat font-bold text-xl w-full py-2 rounded-lg ${
        "px-" + paddingX
      }
        ${colorMap[color]}
      `}
      onClick={onClick}
      name={name}
      type="submit"
      disabled={disabled}
      {...rest}
    >
      {text}
    </button>
  );
}

const colorMap = {
  Green: "bg-simmpy-green text-white",
  Yellow: "bg-simmpy-yellow text-simmpy-gray-800",
  Red: "bg-simmpy-red text-white",
};
