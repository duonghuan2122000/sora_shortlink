import { RowDataPacket } from "mysql2/promise";

/**
 * Entity raw của user
 */
export interface IUserEntityRaw {
  /**
   * Khóa chính
   */
  id: string;
  /**
   * Email người dùng
   */
  email: string;
  /**
   * Thời gian tạo, UTC
   */
  createdDate: Date;
  /**
   * Thời gian cập nhật, UTC
   */
  updatedDate: Date;
}

/**
 * Entity của user
 */
export type IUserEntity = IUserEntityRaw & RowDataPacket;
