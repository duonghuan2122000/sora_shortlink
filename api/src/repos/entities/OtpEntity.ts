import { RowDataPacket } from "mysql2";

export enum IOtpType {
  LoginByMail = "LoginByMail",
}

export enum IOtpStatus {
  Init = "Init",
  Used = "Used",
  Expired = "Expired",
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
   * Thông tin bổ sung
   */
  extraInfo: string | null;
  /**
   * Trường thông tin định danh
   */
  identityVal: string;
  /**
   * Số lần retry tối đa
   */
  maxTimesRetry: number;
  /**
   * Số lần đã thử
   */
  timesRetry: number;
  /**
   * Trạng thái của Otp
   */
  status: IOtpStatus;
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
