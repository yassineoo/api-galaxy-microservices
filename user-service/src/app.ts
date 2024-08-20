import express from "express";
import cors from "cors";
import {handleErrors} from "./utils/errorHandler"
import http from "http";
require("dotenv").config();
const app = express();
import config from "./utils/config"
import { userApiRouter } from "./routes/apiRoute";
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors({ origin: "*" }));
app.use(cors({ origin: true, credentials: true }));

// Add this line to parse JSON bodies
app.use(express.json());
app.use("/userApi",userApiRouter)
app.use((req, res, next) => {
  console.log(`API Gateway received: ${req.method} ${req.url}`);
  next();
});


app.use(handleErrors)
const port = process.env.PORT
app.listen(port,()=>{
    console.log(`user service server is running on port ${port}`)
})


const server = http.createServer(app);
const envConfig = config["development"];
const log = envConfig.log();

// Important - a service should not have a fixed port but should randomly choose one
/*
server.listen(process.env.PORT || 2000,()=>{
    console.log(`user-service server is running on port ${process.env.PORT}`)
});
*/

/*
server.on("listening", () => {
  const addr = server.address();
  const PORT = typeof addr === "string" ? addr : addr?.port;
  const registerService = () =>
    axios
      .put(
        `http://localhost:3001/register/${envConfig.serviceName}/${
          envConfig.version
        }/${
          //  server?.address()?.port ||
          Number(PORT)
        }`
      )
      .catch((err: any) => log.fatal(err));

  const unregisterService = () =>
    axios
      .delete(
        `http://localhost:3001/register/${envConfig.serviceName}/${
          envConfig.version
        }/${
          //  server?.address()?.port ||
          PORT
        }`
      )
      .catch((err: any) => log.fatal(err));

  registerService();
  const interval = setInterval(registerService, 15 * 1000);

  const cleanup = async () => {
    let clean = false;
    if (!clean) {
      clean = true;
      clearInterval(interval);
      await unregisterService();
    }
  };

  process.on("uncaughtException", async () => {
    await cleanup();
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    await cleanup();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await cleanup();
    process.exit(0);
  });

  log.info(
    `Hi there! I'm listening on port ${
      //  server?.address()?.port ||
      PORT
    } in ${app.get("env")} mode.`
  );
});
*/