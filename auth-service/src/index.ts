import express from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import axios from "axios";
import http from "http";
import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import profileRouter from "./routes/profileRouter";
import { specs } from "./utils/swagger";
import config from "./utils/config";
import ValidateEnv, { ENV } from "./utils/env";
import { GrpcAuthServer } from "./grpc/grpc-auth.server";

require("dotenv").config();
const app = express();

ValidateEnv();

const server = http.createServer(app);
const logConfig = config["development"];
const log = logConfig.log();

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

app.use((req, res, next) => {
  console.log(`API Gateway received: ${req.method} ${req.url}`);
  next();
});

app.use("/user", userRouter);
app.use("/profile", profileRouter);
app.use("/", authRouter);
app.get("/hello", (req, res) => res.send("hello"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Important - a service should not have a fixed port but should randomly choose one

server.listen(7000);


server.on("listening", () => {
  const addr = server.address();
  const PORT = typeof addr === "string" ? addr : addr?.port;
  const registerService = () =>
    axios
      .put(
        //  `http://localhost:3001/register/${logConfig.serviceName}/${
        `http://service-registry:3001/register/${logConfig.serviceName}/${logConfig.version
        }/${
        //  server?.address()?.port ||
        Number(PORT)
        }`
      )
      .catch((err: any) => console.log({ err })); //log.fatal(err));

  const unregisterService = () =>
    axios
      .delete(
        `http://service-registry:3001/register/${logConfig.serviceName}/${logConfig.version
        }/${
        //  server?.address()?.port ||
        PORT
        }`
      )
      .catch((err: any) => console.log({ err })); //log.fatal(err));

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

GrpcAuthServer.init();
