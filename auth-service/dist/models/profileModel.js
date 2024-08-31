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
class profileModel {
}
_a = profileModel;
profileModel.addProfile = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield prismaClient_1.prismaClientSingleton.profile_entities.create({
        data: {
            full_name: data.FullName,
            date_of_birth: new Date(data.DateOfBirth),
            user_entities: {
                connect: { id: id },
            },
            profile_picture: data.ProfilePicture,
            location: data.Location,
        },
    });
    return profile;
});
profileModel.updateProfile = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield prismaClient_1.prismaClientSingleton.profile_entities.update({
        where: {
            id: id,
        },
        data: {
            full_name: data.FullName,
            date_of_birth: data.DateOfBirth,
            profile_picture: data.ProfilePicture,
            location: data.Location,
        },
    });
    return updatedUser;
});
profileModel.getAllProfiles = () => __awaiter(void 0, void 0, void 0, function* () {
    const profiles = yield prismaClient_1.prismaClientSingleton.profile_entities.findMany();
    return profiles;
});
profileModel.getProfileById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield prismaClient_1.prismaClientSingleton.profile_entities.findUnique({
        where: {
            id: id,
        },
    });
    return profile;
});
profileModel.getUserProfiles = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield prismaClient_1.prismaClientSingleton.profile_entities.findMany({
        where: {
            id: id,
        },
    });
    return profile;
});
profileModel.deleteProfile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = yield prismaClient_1.prismaClientSingleton.profile_entities.delete({
        where: {
            id: id,
        },
    });
    return profile;
});
profileModel.deleteAllUserProfiles = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const profiles = yield prismaClient_1.prismaClientSingleton.profile_entities.deleteMany({
        where: {
            id: id,
        },
    });
    return profiles;
});
exports.default = profileModel;
