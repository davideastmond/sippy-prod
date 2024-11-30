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
      {dayjs(start).format("ddd MMM DD YYYY")}{" "}
      <div className="flex">
        <p className="font-bold">{dayjs(start).format("HH:mm")}-</p>
        <p className="font-bold">{dayjs(end).format("HH:mm")}</p>
      </div>
    </div>
  );
}
