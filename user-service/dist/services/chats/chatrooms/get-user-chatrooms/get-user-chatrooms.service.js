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
exports.default = get_user_chatrooms_service;
const chatrooms_repository_1 = __importDefault(require("../../../../models/chats/chatrooms.repository"));
const userModel_1 = __importDefault(require("../../../../models/userModel"));
function get_user_chatrooms_service(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        // validation 
        const isUserExist = yield userModel_1.default.isUserExist(userId);
        if (!isUserExist)
            throw new Error("User doesn't exist");
        // await ChatroomsRepository.createChatroom(BigInt(1), BigInt(3))
        const chatrooms = yield chatrooms_repository_1.default.getUserChatrooms(userId);
        console.log({ chatrooms });
        return chatrooms;
    });
}
