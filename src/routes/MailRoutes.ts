/**
 * File mail routes
 * CreatedBy: dbhuan 17/07/2025
 */

import MailService from "@src/services/MailService";
import { IReq, IRes } from "./common/types";
import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";
import { parseReq } from "./common/util";
import { isString } from "jet-validators";

const Validators = {
  sendMail: parseReq({ email: isString, subject: isString, content: isString }),
};

/**
 * Hàm xử lý cho endpoint gửi mail
 */
async function sendMail(req: IReq, res: IRes) {
  const { email, subject, content } = Validators.sendMail(req.body);
  await MailService.sendEmail({ email, subject, content });
  res.status(HttpStatusCodes.OK).end();
}

export default {
  sendMail,
} as const;
