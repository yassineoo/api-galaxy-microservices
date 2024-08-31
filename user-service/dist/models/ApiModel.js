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
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../utils/prisma");
class APIModel {
    static getAPIS(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, limit = "10", page = "1", search = "") {
            // Convert page and limit to integers
            const pageInt = parseInt(page);
            const limitInt = parseInt(limit);
            // console.log(userId)
            // Build the filtering and search conditions
            const whereConditions = {};
            if (search) {
                whereConditions.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ];
            }
            try {
                const apis = yield prisma_1.prismaClientSingleton.api_entities.findMany({
                    where: whereConditions,
                    include: {
                        user_likes: {
                            where: {
                                user_id: userId
                            },
                            select: {
                                user_id: true,
                            },
                        },
                    },
                    skip: (pageInt - 1) * limitInt,
                    take: limitInt,
                });
                // Map products to include the isLiked field
                const finalApis = apis.map((api) => {
                    let newAPI = Object.assign(Object.assign({}, api), { category_id: Number(api.category_id), provider_id: Number(api.provider_id), id: Number(api.id) });
                    //console.log(newAPI)
                    /*delete (newAPI as any).id;
                    Object.assign(newAPI,{
                      api_id : Number(api.id)
                    })*/
                    return Object.assign(Object.assign({}, newAPI), { isLiked: api.user_likes.length > 0 });
                });
                // console.log(finalApis)
                const jsonString = JSON.stringify(finalApis, (key, value) => typeof value == "bigint" ? value.toString() : value);
                //console.log(jsonString)
                return jsonString;
            }
            catch (error) {
                //console.log(error.message)
                throw error;
            }
        });
    }
    static getAPIRating(api_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apiRating = yield prisma_1.prismaClientSingleton.api_entities.findUnique({
                    where: {
                        id: api_id
                    },
                    select: {
                        rating: true
                    }
                });
                return apiRating;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getAPIListForAdmin(admin_id, page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageInt = parseInt(page);
                const limitInt = parseInt(limit);
                // console.log(userId)
                // Build the filtering and search conditions
                const whereConditions = {};
                if (search) {
                    whereConditions.OR = [
                        { name: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } },
                    ];
                }
                const apis = yield prisma_1.prismaClientSingleton.user_entities.findUnique({
                    where: {
                        id: admin_id
                    },
                    select: {
                        api_entities: {
                            where: whereConditions,
                            skip: (pageInt - 1) * limitInt,
                            take: limitInt,
                        }
                    }
                });
                const jsonString = JSON.stringify(apis === null || apis === void 0 ? void 0 : apis.api_entities, (key, value) => typeof value == "bigint" ? value.toString() : value);
                //console.log(jsonString)
                return jsonString;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getAPISForUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apis = yield prisma_1.prismaClientSingleton.user_entities.findUnique({
                    where: {
                        id: user_id
                    },
                    select: {
                        api_entities: true
                    }
                });
                const jsonString = JSON.stringify(apis === null || apis === void 0 ? void 0 : apis.api_entities, (key, value) => typeof value == "bigint" ? value.toString() : value);
                //console.log(jsonString)
                return jsonString;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getUserFollowingApis(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const followingApis = yield prisma_1.prismaClientSingleton.user_entities.findUnique({
                    where: {
                        id: user_id
                    },
                    select: {
                        likes: {
                            select: {
                                api: true
                            }
                        }
                    }
                });
                const finalFollowings = JSON.stringify(followingApis === null || followingApis === void 0 ? void 0 : followingApis.likes, (key, value) => typeof value == "bigint" ? value.toString() : value);
                //console.log(jsonString)
                return finalFollowings;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = APIModel;
