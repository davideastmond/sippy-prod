interface ButtonTextProps {
  text: string;
  color: "Green" | "Yellow";
  name?: string;
  onClick?: () => void;
}

export function ButtonText({
  text,
  onClick,
  color,
  name,
  ...rest
}: ButtonTextProps) {
  return (
    <button
      className={`flex justify-center items-center font-montserrat font-bold text-xl w-full py-2 rounded-lg
        ${
          color === "Green"
            ? "bg-simmpy-green text-white"
            : "bg-simmpy-yellow text-simmpy-gray-800"
        }
      `}
      onClick={onClick}
      name={name}
      type="submit"
      {...rest}
    >
      {text}
    </button>
  );
}
