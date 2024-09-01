"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const updateProfile = {
    FullName: joi_1.default.string(),
    DateOfBirth: joi_1.default.string(),
    Bio: joi_1.default.string(),
    ProfilePicture: joi_1.default.string(),
    Location: joi_1.default.string()
};
exports.default = {
    userProfileSchema: joi_1.default.object(updateProfile),
};
