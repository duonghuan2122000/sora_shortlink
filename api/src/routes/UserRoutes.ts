import { isNumber, isString } from "jet-validators";
import { transform } from "jet-validators/utils";

import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";
import UserService from "@src/services/UserService";
import UserModel from "@src/models/UserModel";

import { IReq, IRes } from "./common/types";
import { parseReq } from "./common/util";

/******************************************************************************
                                Constants
******************************************************************************/

const Validators = {
  add: parseReq({ user: UserModel.test }),
  update: parseReq({ user: UserModel.test }),
  delete: parseReq({ id: transform(Number, isNumber) }),
  loginByMail: parseReq({ data: UserModel.validateLoginUserByMailInput }),
} as const;

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get all users.
 */
async function getAll(_: IReq, res: IRes) {
  const users = await UserService.getAll();
  res.status(HttpStatusCodes.OK).json({ users });
}

/**
 * Add one user.
 */
async function add(req: IReq, res: IRes) {
  const { user } = Validators.add(req.body);
  await UserService.addOne(user);
  res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one user.
 */
async function update(req: IReq, res: IRes) {
  const { user } = Validators.update(req.body);
  await UserService.updateOne(user);
  res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one user.
 */
async function delete_(req: IReq, res: IRes) {
  const { id } = Validators.delete(req.params);
  await UserService.delete(id);
  res.status(HttpStatusCodes.OK).end();
}

/**
 * Hàm xử lý đăng nhập người dùng bằng mail
 */
async function loginByMail(req: IReq, res: IRes) {
  const { data } = Validators.loginByMail(req.body);
  await UserService.loginByMail({ email: data.attributes.email });
  res.status(HttpStatusCodes.OK).end();
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getAll,
  add,
  update,
  delete: delete_,
  loginByMail,
} as const;
