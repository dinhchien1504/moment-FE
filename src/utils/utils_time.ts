import { formatInTimeZone , format } from 'date-fns-tz';
// export const getCurrentTime = () => {
//   return new Date().toISOString();
// };
// export const getTimeZone = () => {
//  return Intl.DateTimeFormat().resolvedOptions().timeZone;
// };

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
};


export function formatUTCToLocalTime(utcDate: string): string {
  // Đặt múi giờ mong muốn (Asia/Ho_Chi_Minh)
  const timeZone = 'Asia/Ho_Chi_Minh';
 return formatInTimeZone(utcDate, timeZone, "yyyy-MM-dd'T'HH:mm:ss")

}
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");
export const formatTimeShort = (dateString: string): string => {
  const now = dayjs();
  const date = dayjs(dateString);
  const diffMinutes = now.diff(date, "minute");
  const diffHours = now.diff(date, "hour");
  const diffDays = now.diff(date, "day");

  if (diffMinutes < 1) return "Vừa xong";
  if (diffMinutes < 60) return `${diffMinutes} phút`;
  if (diffHours < 24) return `${diffHours} giờ`;
  if (diffDays < 7) return `${diffDays} ngày`;
  return date.format("DD/MM"); // hoặc return `${diffDays}ng` nếu vẫn muốn theo ngày
};