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
    <span>
      {dayjs(start).format("ddd MMM DD YYYY")}{" "}
      <p className="font-bold">{dayjs(start).format("HH:mm")} -</p>
      <p className="font-bold">{dayjs(end).format("HH:mm")}</p>
    </span>
  );
}
