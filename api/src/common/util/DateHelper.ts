import dayjs from "dayjs";
import dayUTC from "dayjs/plugin/utc";

dayjs.extend(dayUTC);

function utcNow() {
  return dayjs().utc();
}

export default {
  instance: dayjs,
  utcNow,
} as const;
