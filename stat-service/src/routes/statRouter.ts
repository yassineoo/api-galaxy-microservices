import express from "express";
const statRouter = express.Router();

statRouter.post("/oauth", (req, res) => {
  res.send("oauth");
});

export default statRouter;
