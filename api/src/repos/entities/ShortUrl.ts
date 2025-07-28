import { RowDataPacket } from "mysql2";

export interface IShortUrlRaw {
  /**
   * Khóa chính
   */
  id: string;
  /**
   * Giá trị segment rút gọn
   */
  segmentVal: string;
  /**
   * Url gốc
   */
  originalUrl: string;
  /**
   * Thời gian tạo
   */
  createdDate: Date;
  /**
   * Id user tạo
   */
  createdBy: string;
  /**
   * Thời gian cập nhật
   */
  updatedDate: Date;
}

export type IShortUrl = IShortUrlRaw & RowDataPacket;
