import dayjs, { Dayjs } from"dayjs";
import relativeTime from "dayjs/plugin/relativeTime";


dayjs.extend(relativeTime);



export function formatBlogDate(dateInput: string|Date|number|Dayjs){
    const now=dayjs();
    const date=dayjs(dateInput);
    
    const diffInSeconds = now.diff(date, "second");
    const diffInMinutes = now.diff(date, "minute");

    const diffInHours=now.diff(date,"hour");
    const diffInDays=now.diff(date,"day");
    const diffInWeeks=now.diff(date,"week");

if (diffInSeconds < 60) {
        return `${diffInSeconds} second${diffInSeconds > 1 ? "s" : ""} ago`;
} else if (diffInMinutes < 60) {
                return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
} else if (diffInHours < 24) {
  return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
} else if (diffInDays < 7) {
         return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
}  else if (diffInWeeks < 4) {
           return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
} else {
  return date.format("D MMM");
}
}

