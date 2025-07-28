import { RouteError } from "@src/common/util/route-errors";
import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";

import UserRepo from "@src/repos/UserRepo";
import {
  ILoginUserByMailInput,
  ILoginUserByMailResult,
  ILoginUserResult,
  IUser,
  IVerifyOtpLoginByMailInput,
} from "@src/models/UserModel";

import mysql from "mysql2/promise";
import DbConnection from "@src/repos/DbConnection";
import { IModel, IModelResult } from "@src/models/common/types";
import MailService from "./MailService";
import { randomBytes } from "crypto";
import ENV from "@src/common/constants/ENV";
import { NodeEnvs } from "@src/common/constants";
import logger from "jet-logger";
import OtpRepo from "@src/repos/OtpRepo";
import { IOtpStatus, IOtpType } from "@src/repos/entities/OtpEntity";
import JwtHelper from "@src/common/util/JwtHelper";
import DateHelper from "@src/common/util/DateHelper";

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
  input: ILoginUserByMailInput
): Promise<IModelResult<ILoginUserByMailResult>> {
  var connection: mysql.PoolConnection | null = null;

  try {
    connection = await DbConnection.createDbConnection();

    // khởi tạo kết nối
    var user = await UserRepo.getOneByEmail(input.email, connection);
    if (!user) {
      // thực hiện thêm user
      user = await UserRepo.insert(
        {
          email: input.email,
        },
        connection
      );
    }

    const curUser = user!;

    const otp = generateOTP();

    let otpEntity = await OtpRepo.getCurrentByOtpType(
      {
        otpType: IOtpType.LoginByMail,
        identityVal: curUser.id,
      },
      connection
    );

    if (
      otpEntity &&
      otpEntity.expiresAt > DateHelper.utcNow() &&
      otpEntity.status == IOtpStatus.Init
    ) {
      otpEntity.otp = otp;
      await OtpRepo.update(otpEntity, connection);
    } else {
      await OtpRepo.insert(
        {
          otp,
          otpType: IOtpType.LoginByMail,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
          identityVal: curUser.id,
          maxTimesRetry: 3, // số lần retry tối đa là 3
        },
        connection
      );
    }

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
      data: {
        identityVal: curUser.id,
      },
    };
  } finally {
    if (connection) {
      await DbConnection.releaseDbConnection(connection);
    }
  }
}

/**
 * Hàm thực hiện xác thực OTP login bằng mail
 */
async function verifyOtpLoginByMail(
  input: IVerifyOtpLoginByMailInput
): Promise<IModelResult<ILoginUserResult>> {
  var connection: mysql.PoolConnection | null = null;

  try {
    connection = await DbConnection.createDbConnection();
    const otpEntity = await OtpRepo.getByOtp(
      {
        otp: input.otp,
        otpType: IOtpType.LoginByMail,
        identityVal: input.identityVal,
      },
      connection
    );

    // xác thức OTP
    if (!otpEntity || !(await OtpRepo.verifyOtp(otpEntity!))) {
      return {
        status: false,
        error: {
          code: "OTP_INVALID",
          message: "Otp không hợp lệ",
        },
      };
    }

    // lấy thông tin user
    let curUser = await UserRepo.getById(input.identityVal, connection);

    if (!curUser) {
      return {
        status: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "User khôn tìm thấy",
        },
      };
    }

    let expiresAt = DateHelper.instance(new Date())
      .utc()
      .add(1, "day")
      .toDate();

    let expiresIn = Math.floor(
      (expiresAt.getTime() - DateHelper.utcNow().getTime()) / 1000
    );

    let accessToken = await JwtHelper.generateToken(
      {
        sub: curUser.id,
        email: curUser.email,
      },
      {
        expiresAt,
      }
    );

    otpEntity.timesRetry++;
    otpEntity.status = IOtpStatus.Used;

    await OtpRepo.update(otpEntity, connection);
    return {
      status: true,
      data: {
        accessToken,
        expiresIn,
      },
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
  verifyOtpLoginByMail,
} as const;
