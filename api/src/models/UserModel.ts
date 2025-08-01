import { isString } from "jet-validators";
import { parseObject, testObject, TParseOnError } from "jet-validators/utils";

import { isRelationalKey, transIsDate } from "@src/common/util/validators";
import { IModel, IModelDataInput, IModelInput } from "./common/types";

/******************************************************************************
                                 Constants
******************************************************************************/

const DEFAULT_USER_VALS = (): IUser => ({
  id: -1,
  name: "",
  created: new Date(),
  email: "",
});

/******************************************************************************
                                  Types
******************************************************************************/

export interface IUser extends IModel {
  name: string;
  email: string;
}

export interface ILoginUserByMailInput {
  /**
   * email
   */
  email: string;
}

/**
 * Type model kết quả đăng nhập người dùng bằng mail
 */
export interface ILoginUserByMailResult {
  identityVal: string;
}

export interface IVerifyOtpLoginByMailInput {
  /**
   * otp
   */
  otp: string;
  /**
   * identity Val
   */
  identityVal: string;
}

export interface ILoginUserResult {
  /**
   * access token
   */
  accessToken: string;
  /**
   * Thời gian hiệu lực
   */
  expiresIn: number;
}

/******************************************************************************
                                  Setup
******************************************************************************/

// Initialize the "parseUser" function
const parseUser = parseObject<IUser>({
  id: isRelationalKey,
  name: isString,
  email: isString,
  created: transIsDate,
});

/******************************************************************************
                                 Functions
******************************************************************************/

/**
 * New user object.
 */
function __new__(user?: Partial<IUser>): IUser {
  const retVal = { ...DEFAULT_USER_VALS(), ...user };
  return parseUser(retVal, (errors) => {
    throw new Error("Setup new user failed " + JSON.stringify(errors, null, 2));
  });
}

/**
 * Check is a user object. For the route validation.
 */
function test(arg: unknown, errCb?: TParseOnError): arg is IUser {
  return !!parseUser(arg, errCb);
}

/**
 * Validate input ILoginUserByMailInput
 */
function validateLoginUserByMailInput(
  arg: unknown,
  errCb?: TParseOnError
): arg is IModelDataInput<ILoginUserByMailInput> {
  return !!parseObject<IModelDataInput<ILoginUserByMailInput>>({
    attributes: testObject<ILoginUserByMailInput>({
      email: isString,
    }),
  })(arg, errCb);
}

function validateVerifyOtpLoginByMail(
  arg: unknown,
  errCb?: TParseOnError
): arg is IModelDataInput<IVerifyOtpLoginByMailInput> {
  return !!parseObject<IModelDataInput<IVerifyOtpLoginByMailInput>>({
    attributes: testObject<IVerifyOtpLoginByMailInput>({
      otp: isString,
      identityVal: isString,
    }),
  })(arg, errCb);
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  new: __new__,
  test,
  validateLoginUserByMailInput,
  validateVerifyOtpLoginByMail,
} as const;
