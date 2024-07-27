import { Request, Response } from "express";

require("dotenv").config();
const express = require("express");

const getStats = async (req: Request, res: Response) => {
  res.send(200);
};

export default { getStats };
