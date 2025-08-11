import dayjs from"dayjs";
import relativeTime from "dayjs/plugin/relativeTime";


dayjs.extend(relativeTime);



export function formatBlogDate(dateString: string){
    const now=dayjs();
    const date=dayjs(dateString);


    const diffInHours=now.diff(date,"hour");
    const diffInDays=now.diff(date,"day");
    const diffInWeeks=now.diff(date,"week");

    if(diffInHours<24){
            return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
   }else if(diffInDays<7){
            return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;


    }else if(diffInWeeks<4){
            return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;


    }
    else{
        return date.format("D MMM")
    }
}

