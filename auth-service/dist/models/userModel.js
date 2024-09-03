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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = require("../utils/prismaClient");
const currentDate = new Date();
class userModel {
}
_a = userModel;
userModel.AddUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prismaClient_1.prismaClientSingleton.user_entities.create({
            data: {
                username: data.Username,
                email: data.Email,
                password_hash: data.PasswordHash,
                // phone_number: data.PhoneNumber,
                image: data.Image,
                date_created: currentDate.toISOString(),
                last_login: currentDate.toISOString(),
                is_active: true,
                role: data.role || "userClient",
            },
        });
        return user;
    }
    catch (error) {
        console.error("Error in AddUser:", error);
        throw error;
    }
});
userModel.updateUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield prismaClient_1.prismaClientSingleton.user_entities.update({
            where: {
                id: id,
            },
            data: data,
        });
        return updatedUser;
    }
    catch (error) {
        console.error("Error in updateUser:", error);
        throw error;
    }
});
userModel.getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prismaClient_1.prismaClientSingleton.user_entities.findUnique({
            where: {
                id: id,
            },
        });
        if (!user) {
            console.log("No data found for getUserById");
        }
        return user;
    }
    catch (error) {
        console.error("Error in getUserById:", error);
        throw error;
    }
});
userModel.getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!email) {
            throw new Error("Email parameter is undefined");
        }
        const user = yield prismaClient_1.prismaClientSingleton.user_entities.findUnique({
            where: {
                email: email,
            },
        });
        return user;
    }
    catch (error) {
        console.error("Error in getUserByEmail:", error);
        throw error;
    }
});
userModel.getUserByPhoneNumber = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!phoneNumber) {
            throw new Error("PhoneNumber parameter is undefined");
        }
        const user = yield prismaClient_1.prismaClientSingleton.user_entities.findUnique({
            where: {
                phone_number: phoneNumber.toString(),
            },
        });
        return user;
    }
    catch (error) {
        console.error("Error in getUserByPhoneNumber:", error);
        throw error;
    }
});
userModel.getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prismaClient_1.prismaClientSingleton.user_entities.findMany();
        if (users.length === 0) {
            console.log("No data found for getAllUsers");
        }
        return users;
    }
    catch (error) {
        console.error("Error in getAllUsers:", error);
        throw error;
    }
});
userModel.deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield prismaClient_1.prismaClientSingleton.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.profiles.deleteMany({ where: { UserID: id } });
            yield prisma.user_entities.delete({ where: { UserID: id } });
        }));
        return transaction;
    }
    catch (error) {
        console.error("Error in deleteUser transaction:", error);
        throw error;
    }
});
userModel.setLastLogin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prismaClient_1.prismaClientSingleton.user_entities.update({
            where: {
                id,
            },
            data: {
                last_login: currentDate.toISOString(),
            },
        });
        return user;
    }
    catch (error) {
        console.error("Error in setLastLogin:", error);
        throw error;
    }
});
userModel.getHashedPassword = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prismaClient_1.prismaClientSingleton.user_entities.findUnique({
            where: {
                id,
            },
            select: {
                password_hash: true,
            },
        });
        if (!user) {
            console.log("No data found for getHashedPassword");
            throw new Error("No data found");
        }
        return user ? user.password_hash : null;
    }
    catch (error) {
        console.error("Error in getHashedPassword:", error);
        throw error;
    }
});
exports.default = userModel;
