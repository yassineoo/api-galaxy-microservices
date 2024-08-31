"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect_user_event_validator = void 0;
const zod_1 = require("zod");
const _common_1 = require("../../_common");
exports.connect_user_event_validator = zod_1.z.object({
    userId: _common_1.id_validator,
});
