import { NextFunction, Request, Response } from "express";
import { notificationsService } from "../services/notifService";

export async function getUserNotifications(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Id is not valid");
    }

    const NOTIF = await notificationsService.getUserNotifications(Number(id));
    console.log("notifications listss 3333", NOTIF);
    res.status(200).send(NOTIF);
  } catch (error) {
    next(error);
  }
}
