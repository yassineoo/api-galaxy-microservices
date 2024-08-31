"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_chatroom_messages_validator = void 0;
const zod_1 = require("zod");
const _common_1 = require("../../_common");
const params_validator = zod_1.z.object({
    chatroomId: _common_1.id_validator
});
exports.get_chatroom_messages_validator = {
    params: params_validator
};
