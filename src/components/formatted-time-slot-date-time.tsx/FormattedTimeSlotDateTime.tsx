import dayjs from "dayjs";

export default function FormattedTimeSlotDateTime({
  start,
  end,
}: {
  start?: Date;
  end?: Date;
}) {
  if (!start || !end) {
    return <span>Not confirmed</span>;
  }

  return (
    <div>
      {dayjs(start).format("MMM DD YYYY")}{" "}
      <div className="flex">
        <p className="font-bold">{dayjs(start).format("H:mm")}-</p>
        <p className="font-bold">{dayjs(end).format("H:mm")}</p>
      </div>
    </div>
  );
}
