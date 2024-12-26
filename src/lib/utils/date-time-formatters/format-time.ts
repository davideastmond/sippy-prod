export const formatTime = (time?: string | Date) => {
  if (!time) return "Unknown Time";
  const date = typeof time === "string" ? new Date(time) : time;
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};
