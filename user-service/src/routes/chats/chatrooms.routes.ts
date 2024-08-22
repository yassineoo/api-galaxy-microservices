import { Router } from "express";
import ChatroomsController from "../../controllers/chats/chatrooms.controller";
import MessagesController from "../../controllers/chats/messages.controller";

const ChatroomsRouter = Router();

// Messages Route
ChatroomsRouter.route("/:chatroomId/messages")
  .get(MessagesController.get_chatroom_messages)
  .post(MessagesController.create_chatroom_message);

ChatroomsRouter.route("/:chatroomId")
  .get(ChatroomsController.get_chatroom)
  .delete(ChatroomsController.delete_chatroom);

ChatroomsRouter.get("/users/:userId", ChatroomsController.get_user_chatrooms);
ChatroomsRouter.post("/", ChatroomsController.create_chatroom);

export default ChatroomsRouter;
