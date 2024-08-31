"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const try_catch_controller_1 = __importDefault(require("../../utils/try-catch-controller"));
const get_chatroom_messages_request_1 = require("../../validators/chats/messages/get-chatroom-messages/get-chatroom-messages.request");
const get_chatroom_messages_service_1 = __importDefault(require("../../services/chats/messages/get-chatroom-messages/get-chatroom-messages.service"));
const create_chatroom_message_service_1 = __importDefault(require("../../services/chats/messages/create-chatroom-message/create-chatroom-message.service"));
const create_chatroom_message_request_1 = require("../../validators/chats/messages/create-chatroom-message/create-chatroom-message.request");
function get_chatroom_messages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, try_catch_controller_1.default)(res, () => __awaiter(this, void 0, void 0, function* () {
            console.log({ params: req.params });
            const { chatroomId } = get_chatroom_messages_request_1.get_chatroom_messages_validator.params.parse(req.params);
            return yield (0, get_chatroom_messages_service_1.default)(chatroomId);
        }));
    });
}
function create_chatroom_message(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, try_catch_controller_1.default)(res, () => __awaiter(this, void 0, void 0, function* () {
            const { content, senderId } = create_chatroom_message_request_1.create_chatroom_message_validator.body.parse(req.body);
            const { chatroomId } = create_chatroom_message_request_1.create_chatroom_message_validator.params.parse(req.params);
            return yield (0, create_chatroom_message_service_1.default)(chatroomId, senderId, content);
        }));
    });
}
const MessagesController = {
    get_chatroom_messages,
    create_chatroom_message
};
exports.default = MessagesController;
