import mysql from "mysql2/promise";
import {
  IOtpEntity,
  IOtpEntityRaw,
  IOtpStatus,
  IOtpType,
} from "./entities/OtpEntity";
import BaseRepo from "./BaseRepo";
import DateHelper from "@src/common/util/DateHelper";
/**
 * Hàm lưu thông tin OTP
 */
async function insert(
  otpEntity: Partial<IOtpEntityRaw>,
  connection: mysql.PoolConnection
): Promise<void> {
  const query = `INSERT INTO soraOtp 
    (id, otp, otpType, expiresAt, extraInfo, identityVal, maxTimesRetry, timesRetry, status, createdDate, updatedDate) 
    values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
  await connection.execute(query, [
    BaseRepo.genUUID(),
    otpEntity.otp,
    otpEntity.otpType,
    otpEntity.expiresAt,
    otpEntity.extraInfo || null,
    otpEntity.identityVal,
    otpEntity.maxTimesRetry || 0,
    otpEntity.timesRetry || 0,
    otpEntity.status || IOtpStatus.Init,
    DateHelper.toSqlDateTime(new Date()),
    null,
  ]);
}

/**
 * Hàm update thông tin OTP
 */
async function update(
  otpEntityRaw: IOtpEntityRaw,
  connection: mysql.PoolConnection
): Promise<void> {
  const query = `UPDATE soraOtp 
    SET otp = ?, 
      otpType = ?, 
      expiresAt = ?, 
      extraInfo = ?, 
      identityVal = ?, 
      maxTimesRetry = ?, 
      timesRetry = ?, 
      status = ?, 
      updatedDate = ? 
    WHERE id = ?;`;
  await connection.execute(query, [
    otpEntityRaw.otp,
    otpEntityRaw.otpType,
    otpEntityRaw.expiresAt,
    otpEntityRaw.extraInfo || null,
    otpEntityRaw.identityVal,
    otpEntityRaw.maxTimesRetry || 0,
    otpEntityRaw.timesRetry || 0,
    otpEntityRaw.status || IOtpStatus.Init,
    DateHelper.toSqlDateTime(new Date()),
    otpEntityRaw.id,
  ]);
}

/**
 * Hàm lấy thông tin OTP
 */
async function getByOtp(
  {
    otp,
    otpType,
    identityVal,
  }: {
    otp: string;
    otpType: IOtpType;
    identityVal: string;
  },
  connection: mysql.PoolConnection
): Promise<IOtpEntity | null> {
  const query =
    "SELECT * FROM soraOtp u WHERE u.otpType = ? AND u.otp = ? AND u.identityVal = ? ORDER BY u.createdDate DESC LIMIT 1";
  const [rows] = await connection.query<IOtpEntity[]>(query, [
    otpType,
    otp,
    identityVal,
  ]);
  if (rows?.length == 1) {
    return rows[0];
  }
  return null;
}

async function verifyOtp(otpEntity: IOtpEntity): Promise<Boolean> {
  if (
    otpEntity.status != IOtpStatus.Init ||
    otpEntity.expiresAt <= DateHelper.utcNow() ||
    otpEntity.maxTimesRetry <= otpEntity.timesRetry
  ) {
    return false;
  }
  return true;
}

/**
 * Hàm lấy thông tin bản ghi OTP hiện tại (gần nhất) theo loại
 */
async function getCurrentByOtpType(
  {
    otpType,
    identityVal,
  }: {
    otpType: IOtpType;
    identityVal: string;
  },
  connection: mysql.PoolConnection
): Promise<IOtpEntity | null> {
  const query =
    "SELECT * FROM soraOtp u WHERE u.otpType = ? AND u.identityVal = ? ORDER BY u.createdDate DESC LIMIT 1";
  const [rows] = await connection.query<IOtpEntity[]>(query, [
    otpType,
    identityVal,
  ]);
  if (rows?.length == 1) {
    return rows[0];
  }
  return null;
}

export default {
  insert,
  update,
  getByOtp,
  verifyOtp,
  getCurrentByOtpType,
} as const;
