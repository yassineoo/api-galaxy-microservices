import { Router } from "express";
import controller from "../../../../chat-service/src/controllers/chats/messages.controller";

const MessagesRouter = Router();

MessagesRouter.get("/", controller.get_chatroom_messages);
MessagesRouter.post("/", controller.create_chatroom_message);

export default MessagesRouter;