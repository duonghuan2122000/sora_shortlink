import { isString } from "jet-validators";
import { IReq, IRes } from "./common/types";
import { parseReq } from "./common/util";
import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";

const Validators = {
  accessShortUrl: parseReq({
    segmentVal: isString,
  }),
};

async function accessShortUrl(req: IReq, res: IRes) {
  const { segmentVal } = Validators.accessShortUrl(req.params);
  res.status(HttpStatusCodes.FOUND).redirect("https://google.com");
}

export default {
  accessShortUrl,
} as const;
