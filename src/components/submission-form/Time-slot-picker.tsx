import { TimeSlot } from "@/types/time-slot";
import { Radio, RadioGroup, RadioProps, cn } from "@nextui-org/react";
import { useState } from "react";

interface TimeSlotPickerProps {
  value?: TimeSlot | string;
  onChange?: { (value: TimeSlot): void };
}

export const TimeSlotPicker = ({ value, onChange }: TimeSlotPickerProps) => {
  const [selected, setSelected] = useState<TimeSlot | string>(
    value || TimeSlot.Morning
  );

  const handleTimeSlotChange = (value: string) => {
    setSelected(value);
    onChange?.(value as TimeSlot);
  };
  return (
    <RadioGroup
      orientation="vertical"
      value={selected}
      onValueChange={handleTimeSlotChange}
    >
      <CustomRadio value={TimeSlot.Morning}>8:00 - 11:00</CustomRadio>
      <CustomRadio value={TimeSlot.Afternoon}>11:00 - 14:00</CustomRadio>
      <CustomRadio value={TimeSlot.Evening}>14:00 - 17:00</CustomRadio>
    </RadioGroup>
  );
};

const CustomRadio = (props: RadioProps) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-content1  items-center justify-between",
          "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary bg-simmpy-gray-800 "
        ),
        label: cn("text-simmpy-gray-100"),
      }}
    >
      {children}
    </Radio>
  );
};
