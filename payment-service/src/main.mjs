import axios from "axios";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import stripeRouter from "./routes/stripeRouter.mjs";
import http from "http";
import config from "./utils/config.mjs";
import subscriptionRouter from "./routes/subscriptionRouter.mjs";
import transactionRouter from "./routes/transcationRouter.mjs";
import stripeCrudRouter from "./routes/stripeCrudRouter.mjs";

dotenv.config();
const app = express();
const port = 7004;
const server = http.createServer(app);
const envConfig = config["development"];
const log = envConfig.log();

app.use(express.urlencoded({ extended: true })); 
app.use(cors());
app.use(
  express.json({
    verify: function (req, res, buf) {
      if (req.originalUrl.startsWith("/webhook")) {
        req.rawBody = buf.toString();
      }
    },
  })
);

app.use("/stripeCRUD", stripeCrudRouter);
app.use("/stripe-subscription", stripeRouter);
app.use("/subscription", subscriptionRouter);
app.use("/transcation", transactionRouter);

app.use("/", (req, res) => {
  res.send("payment service");
});

app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).send("Internal Server Error");
});
server.listen(7004);

server.on("listening", () => {
  const addr = server.address();
  const PORT = typeof addr === "string" ? addr : addr?.port;
  const registerService = () =>
    axios
      .put(
        `http://service-registry:3001/register/${envConfig.serviceName}/${envConfig.version
        }/${Number(PORT)}`
      )
      .catch((err) => log.fatal(err));

  const unregisterService = () =>
    axios
      .delete(
        `http://service-registry:3001/register/${envConfig.serviceName}/${envConfig.version
        }/${PORT}`
      )
      .catch((err) => log.fatal(err));

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


  // Event handlers for uncaught exceptions and unhandled rejections
  process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception:", err);
    await cleanup();
    process.exit(1);
  });

  process.on("unhandledRejection", async (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    await cleanup();
    process.exit(1);
  });

  process.on("SIGINT", async () => {
    await cleanup();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await cleanup();
    process.exit(0);
  });

  log.info(`Hi there! I'm listening on port ${PORT} in ${app.get("env")} mode.`);
});
