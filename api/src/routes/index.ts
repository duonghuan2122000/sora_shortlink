import { Router } from "express";

import Paths from "@src/common/constants/Paths";
import UserRoutes from "./UserRoutes";
import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";
import MailRoutes from "./MailRoutes";
import ShortUrlRoutes from "./ShortUrlRoutes";

/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();

// ** Health endpoint ** //

apiRouter.get(Paths.Health, (_: any, res: any) =>
  res.status(HttpStatusCodes.OK).end("healthy")
);

// ** Add UserRouter ** //

// Init router
const userRouter = Router();

// Get all users
userRouter.get(Paths.Users.Get, UserRoutes.getAll);
userRouter.post(Paths.Users.Add, UserRoutes.add);
userRouter.put(Paths.Users.Update, UserRoutes.update);
userRouter.delete(Paths.Users.Delete, UserRoutes.delete);
userRouter.post(
  Paths.Users.VerifyOtpLoginByMail,
  UserRoutes.verifyOtpLoginByMail
);
userRouter.post(Paths.Users.LoginByMail, UserRoutes.loginByMail);

// Add UserRouter
apiRouter.use(Paths.Users.Base, userRouter);

/**
 * Mail Router
 */
const mailRouter = Router();
mailRouter.post(Paths.Mails.Send, MailRoutes.sendMail);
// add MailRouter
apiRouter.use(Paths.Mails.Base, mailRouter);

/**
 * Short Url
 */
const shortUrlRouter = Router();
shortUrlRouter.get(Paths.ShortUrls.Access, ShortUrlRoutes.accessShortUrl);
apiRouter.use(Paths.ShortUrls.Base, shortUrlRouter);

/******************************************************************************
                                Export default
******************************************************************************/

export default apiRouter;
