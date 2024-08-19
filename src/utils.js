import { DateTime } from "luxon";

export function debounce(func, wait) {
  let timeout;

  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}
export function formatDateTime(dateString) {
  const now = DateTime.local();
  const dateTime = DateTime.fromISO(dateString);

  const diffInDays = Math.floor(
    now.startOf("day").diff(dateTime.startOf("day"), "days").days
  );

  if (now.hasSame(dateTime, "day")) {
    return dateTime.toRelative({
      padding: 60000,
      numeric: "auto",
      style: "short",
    });
  } else if (diffInDays === 1) {
    return `Yesterday, ${dateTime.toLocaleString(DateTime.TIME_SIMPLE)}`;
  } else if (diffInDays < 7) {
    const parts = dateTime.toLocaleParts(DateTime.DATETIME_MED_WITH_WEEKDAY);

    let displayString = "";
    for (let index = 0; index < parts.length; index++) {
      const part = parts[index];
      if (["year", "month", "day"].includes(part.type)) {
        index++;
      } else {
        displayString += part.value;
      }
    }

    return displayString;
    // return `${dateTime.toFormat("ccc")} ${dateTime.toLocaleString(
    //   DateTime.TIME_SIMPLE
    // )}`;
  } else if (now.hasSame(dateTime, "year")) {
    const parts = dateTime.toLocaleParts(DateTime.DATETIME_MED);

    let displayString = "";
    for (let index = 0; index < parts.length; index++) {
      const part = parts[index];
      if (part.type === "year") {
        index++;
      } else {
        displayString += part.value;
      }
    }

    return displayString;
  } else {
    return dateTime.toLocaleString(DateTime.DATETIME_MED);
  }
}
