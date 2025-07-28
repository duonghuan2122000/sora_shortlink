import jetEnv, { num, str } from "jet-env";
import { isEnumVal } from "jet-validators";

import { NodeEnvs } from ".";

/******************************************************************************
                                 Setup
******************************************************************************/

const ENV = jetEnv({
  NodeEnv: isEnumVal(NodeEnvs),
  Port: num,
  EmailService: str,
  EmailUser: str,
  EmailPass: str,
  DatabaseUrl: str,
  JwtSecret: str,
  JwtIssuer: str,
  JwtAudience: str,
});

/******************************************************************************
                            Export default
******************************************************************************/

export default ENV;
