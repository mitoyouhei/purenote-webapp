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


function extractTextRecursive(node, limit, result = { text: "", length: 0 }) {
  if (!node?.children || result.length >= limit) {
    return result.text;
  }

  for (const child of node.children) {
    if (child.type === "text" && child.text) {
      const remainingLength = limit - result.length;
      const textToAdd = child.text.slice(0, remainingLength);
      result.text += textToAdd + " ";
      result.length += textToAdd.length + 1;

      if (result.length >= limit) {
        return result.text;
      }
    } else if (child.children) {
      extractTextRecursive(child, limit, result);
      if (result.length >= limit) {
        return result.text;
      }
    }
  }

  return result.text;
}

export function extractText(serializedData, limit = 100) {
  try {
    const data =
      typeof serializedData === "string"
        ? JSON.parse(serializedData)
        : serializedData;
    if (!data?.root?.children || !Array.isArray(data.root.children)) {
      throw new Error("Invalid Lexical data structure");
    }
    return extractTextRecursive({ children: data.root.children }, limit);
  } catch (error) {
    console.error("Error extracting text:", error);
    return "";
  }
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
