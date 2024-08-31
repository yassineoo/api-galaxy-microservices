"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.content_validator = exports.id_validator = void 0;
const zod_1 = require("zod");
exports.id_validator = zod_1.z.coerce.bigint();
exports.content_validator = zod_1.z.string().min(1).max(500);
