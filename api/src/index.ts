import logger from "jet-logger";

import ENV from "@src/common/constants/ENV";
import server from "./server";
import mysql from "mysql2/promise";
import DbConnection from "./repos/DbConnection";

/******************************************************************************
                                Constants
******************************************************************************/

const SERVER_START_MSG =
  "Express server started on port: " + ENV.Port.toString();

/******************************************************************************
                                  Run
******************************************************************************/

(async function () {
  let dbConn: mysql.PoolConnection | null = null;

  try {
    dbConn = await DbConnection.createDbConnection();
    await DbConnection.pingDbConnection(dbConn);

    // kiểm tra kết nối tới db có ok không?

    // Start the server
    server.listen(ENV.Port, (err) => {
      if (!!err) {
        logger.err(err.message);
      } else {
        logger.info(SERVER_START_MSG);
      }
    });
  } finally {
    if (dbConn) {
      await DbConnection.releaseDbConnection(dbConn);
    }
  }
})();
