import { RowDataPacket } from "mysql2";

export enum IOtpType {
  LoginByMail = "LoginByMail",
}

/**
 * Entity OTP
 */
export interface IOtpEntityRaw {
  /**
   * Khóa chính
   */
  id: string;
  /**
   * OTP
   */
  otp: string;
  /**
   * Loại OTP
   */
  otpType: IOtpType;
  /**
   * Thời gian hết hạn OTP
   */
  expiresAt: Date;
  /**
   * Thời gian tạo, UTC
   */
  createdDate: Date;
  /**
   * Thời gian cập nhật, UTC
   */
  updatedDate: Date;
}

export type IOtpEntity = IOtpEntityRaw & RowDataPacket;
