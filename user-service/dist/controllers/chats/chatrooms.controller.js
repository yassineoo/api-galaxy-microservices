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
const get_user_chatrooms_request_1 = require("../../validators/chats/chatrooms/get-user-chatrooms/get-user-chatrooms.request");
const get_user_chatrooms_service_1 = __importDefault(require("../../services/chats/chatrooms/get-user-chatrooms/get-user-chatrooms.service"));
const get_chatroom_request_1 = require("../../validators/chats/chatrooms/get-chatroom/get-chatroom.request");
const get_chatroom_service_1 = __importDefault(require("../../services/chats/chatrooms/get-chatroom/get-chatroom.service"));
const create_chatroom_service_1 = __importDefault(require("../../services/chats/chatrooms/create-chatroom/create-chatroom.service"));
const create_chatroom_request_1 = require("../../validators/chats/chatrooms/create-chatroom/create-chatroom.request");
const delete_chatroom_request_1 = require("../../validators/chats/chatrooms/delete-chatroom/delete-chatroom.request");
const delete_chatroom_service_1 = __importDefault(require("../../services/chats/chatrooms/delete-chatroom/delete-chatroom.service"));
function get_user_chatrooms(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, try_catch_controller_1.default)(res, () => __awaiter(this, void 0, void 0, function* () {
            const { userId } = get_user_chatrooms_request_1.get_user_chatrooms_validator.params.parse(req.params);
            const user_chatrooms = yield (0, get_user_chatrooms_service_1.default)(userId);
            return user_chatrooms;
        }));
    });
}
function get_chatroom(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, try_catch_controller_1.default)(res, () => __awaiter(this, void 0, void 0, function* () {
            const { chatroomId } = get_chatroom_request_1.get_chatroom_validator.params.parse(req.params);
            return yield (0, get_chatroom_service_1.default)(chatroomId);
        }));
    });
}
function create_chatroom(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, try_catch_controller_1.default)(res, () => __awaiter(this, void 0, void 0, function* () {
            const { creatorId, receptorId } = create_chatroom_request_1.create_chatroom_validator.body.parse(req.body);
            return yield (0, create_chatroom_service_1.default)(creatorId, receptorId);
        }));
    });
}
function delete_chatroom(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, try_catch_controller_1.default)(res, () => __awaiter(this, void 0, void 0, function* () {
            const { chatroomId, userId } = delete_chatroom_request_1.delete_chatroom_validator.body.parse(req.params);
            return yield (0, delete_chatroom_service_1.default)(userId, chatroomId);
        }));
    });
}
const ChatroomsController = {
    get_user_chatrooms,
    get_chatroom,
    create_chatroom,
    delete_chatroom
};
exports.default = ChatroomsController;
