import { Request as Req } from "express";

export interface Request extends Req {
  userId?: number;
}
