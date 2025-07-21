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

/**
 * Hàm kiểm tra kết nối tới db
 */
async function pingDbConnection(
  connection: mysql.PoolConnection
): Promise<void> {
  return connection.ping();
}

export default {
  createDbConnection,
  releaseDbConnection,
  pingDbConnection,
} as const;
