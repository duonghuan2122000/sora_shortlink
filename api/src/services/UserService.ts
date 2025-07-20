import { RouteError } from "@src/common/util/route-errors";
import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";

import UserRepo from "@src/repos/UserRepo";
import {
  ILoginUserByMailInput,
  ILoginUserByMailResult,
  IUser,
} from "@src/models/User";

import mysql from "mysql2/promise";
import DbConnection from "@src/repos/DbConnection";
import { IModelResult } from "@src/models/common/types";
import MailService from "./MailService";
import { randomBytes } from "crypto";
import ENV from "@src/common/constants/ENV";
import { NodeEnvs } from "@src/common/constants";
import logger from "jet-logger";

/******************************************************************************
                                Constants
******************************************************************************/

export const USER_NOT_FOUND_ERR = "User not found";

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get all users.
 */
function getAll(): Promise<IUser[]> {
  return UserRepo.getAll();
}

/**
 * Add one user.
 */
function addOne(user: IUser): Promise<void> {
  return UserRepo.add(user);
}

/**
 * Update one user.
 */
async function updateOne(user: IUser): Promise<void> {
  const persists = await UserRepo.persists(user.id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }
  // Return user
  return UserRepo.update(user);
}

/**
 * Delete a user by their id.
 */
async function _delete(id: number): Promise<void> {
  const persists = await UserRepo.persists(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }
  // Delete user
  return UserRepo.delete(id);
}

function generateOTP() {
  const buffer = randomBytes(4);
  const otp = buffer.readUInt32BE(0) % 1000000;
  return otp.toString().padStart(6, "0");
}

/**
 * Hàm thực hiện đăng ký user
 */
async function loginByMail(
  registerUser: ILoginUserByMailInput
): Promise<IModelResult<ILoginUserByMailResult>> {
  var connection: mysql.PoolConnection | null = null;

  try {
    connection = await DbConnection.createDbConnection();

    // khởi tạo kết nối
    var user = await UserRepo.getOneByEmail(registerUser.email, connection);
    if (!user) {
      // thực hiện thêm user
      user = await UserRepo.insert(
        {
          email: registerUser.email,
        },
        connection
      );
    }

    const curUser = user!;

    const otp = generateOTP();

    if (ENV.NodeEnv !== NodeEnvs.Dev) {
      // Gửi mail OTP
      await MailService.sendEmail({
        email: curUser.email,
        subject: `[Sora Shortlink] [${otp}] OTP đăng nhập`,
        content: `<h1>OTP: ${otp} là OTP đăng nhập của phiên hiện tại</h1>`,
      });
    } else {
      logger.info(`OTP: ${otp} là OTP đăng nhập của phiên hiện tại`);
    }

    return {
      status: true,
      data: {},
    };
  } finally {
    if (connection) {
      await DbConnection.releaseDbConnection(connection);
    }
  }
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getAll,
  addOne,
  updateOne,
  delete: _delete,
  loginByMail,
} as const;
