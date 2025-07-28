import dayjs from "dayjs";
import dayUTC from "dayjs/plugin/utc";

dayjs.extend(dayUTC);

/**
 * Hàm lấy thời gian hiện tại theo UTC
 * @returns thời gian hiện tại theo UTC
 */
function utcNow() {
  return dayjs().utc().toDate();
}

/**
 * Chuyển về thời gian hành tại theo UTC
 * @param date thời gian hành tại theo UTC
 * @returns
 */
function toSqlDateTime(date: Date) {
  return dayjs(date).utc().format("YYYY-MM-DD HH:mm:ss");
}

export default {
  instance: dayjs,
  utcNow,
  toSqlDateTime,
} as const;
