"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_chatroom_validator = void 0;
const zod_1 = require("zod");
const _common_1 = require("../../_common");
const body_validator = zod_1.z.object({
    userId: _common_1.id_validator,
    chatroomId: _common_1.id_validator
});
exports.delete_chatroom_validator = {
    body: body_validator
};
