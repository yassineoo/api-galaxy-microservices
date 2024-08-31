"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const updateUser = {
    Username: joi_1.default.string(),
    FullName: joi_1.default.string(),
    Email: joi_1.default.string().email().messages({
        "string.email": "Email must be a valid email"
    }),
};
const updateRole = {
    Role: joi_1.default.string().valid("admin", "moderator", "userClient", "userProvider").messages({
        "string.valid": "Role must be either 'admin' or 'user' or 'moderator' or 'userClient' or 'userProvider'"
    }),
};
exports.default = {
    updateRoleSchema: joi_1.default.object(updateRole),
    updateSchema: joi_1.default.object(updateUser),
};
