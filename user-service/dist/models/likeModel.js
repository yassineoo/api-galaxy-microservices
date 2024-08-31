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
const errorHandler_1 = require("../utils/errorHandler");
const prisma_1 = require("../utils/prisma");
class LikeModel {
    static addLike(user_id, api_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check if existing api is Liked 
                const existingLike = yield prisma_1.prismaClientSingleton.like_entities.findUnique({
                    where: {
                        user_id_api_id: {
                            user_id,
                            api_id
                        }
                    }
                });
                if (existingLike) {
                    throw new errorHandler_1.UserError("this api is already liked !");
                }
                else {
                    yield prisma_1.prismaClientSingleton.like_entities.create({
                        data: {
                            user_id,
                            api_id
                        }
                    });
                    return true;
                }
            }
            catch (error) {
                console.log(error.message);
                throw error;
            }
        });
    }
    static dislikeApi(user_id, api_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma_1.prismaClientSingleton.like_entities.delete({
                    where: {
                        user_id_api_id: {
                            user_id,
                            api_id
                        }
                    }
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = LikeModel;
