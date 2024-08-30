import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import stripeRouter from "./routes/stripeRouter.mjs";

dotenv.config();
const app = express();
const port = 4242;

app.use(express.urlencoded());
app.use(cors());
app.use(
  express.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function (req, res, buf) {
      if (req.originalUrl.startsWith("/webhook")) {
        req.rawBody = buf.toString();
      }
    },
  })
);

app.use("/stripe-subscription", stripeRouter);

app.use("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
