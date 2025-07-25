import mysql from "mysql2/promise";
import { IOtpEntityRaw } from "./entities/OtpEntity";
import BaseRepo from "./BaseRepo";
import DateHelper from "@src/common/util/DateHelper";
/**
 * Hàm lưu thông tin OTP
 */
async function insert(
  otpEntity: Partial<IOtpEntityRaw>,
  connection: mysql.PoolConnection
): Promise<void> {
  const query =
    "INSERT INTO soraOtp (id, otp, otpType, expiresAt, createdDate, updatedDate) values (?, ?, ?, ?, ?, ?);";
  await connection.execute(query, [
    BaseRepo.genUUID(),
    otpEntity.otp,
    otpEntity.otpType,
    otpEntity.expiresAt,
    DateHelper.utcNow(),
    null,
  ]);
}

export default {
  insert,
} as const;
