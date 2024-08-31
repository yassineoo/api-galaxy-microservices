"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_chatroom_validator = void 0;
const zod_1 = require("zod");
const _common_1 = require("../../_common");
const body_validator = zod_1.z.object({
    creatorId: _common_1.id_validator,
    receptorId: _common_1.id_validator
});
exports.create_chatroom_validator = {
    body: body_validator
};
