/**
 * Xử lý kết nối tới database
 * CreatedBy: dbhuan
 */
import ENV from "@src/common/constants/ENV";
import mysql from "mysql2/promise";

const mysqlPool = mysql.createPool(ENV.DatabaseUrl || "");

/**
 * Hàm khởi tạo một kết nối tới db từ pool
 */
async function createDbConnection(): Promise<mysql.PoolConnection> {
  return await mysqlPool.getConnection();
}

/**
 * Hàm thực hiện release connection với pool
 */
async function releaseDbConnection(
  connection: mysql.PoolConnection
): Promise<void> {
  return connection.release();
}

export default {
  createDbConnection,
  releaseDbConnection,
} as const;
