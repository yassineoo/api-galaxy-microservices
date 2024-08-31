"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_chatroom_message_event_validator = exports.create_chatroom_message_validator = void 0;
const zod_1 = require("zod");
const _common_1 = require("../../_common");
const body_validator = zod_1.z.object({
    content: _common_1.content_validator,
    senderId: _common_1.id_validator
});
const params_validator = zod_1.z.object({
    chatroomId: _common_1.id_validator,
});
exports.create_chatroom_message_validator = {
    body: body_validator,
    params: params_validator
};
exports.create_chatroom_message_event_validator = zod_1.z.object({
    content: _common_1.content_validator,
    senderId: _common_1.id_validator,
    chatroomId: _common_1.id_validator,
    receiverId: _common_1.id_validator
});
