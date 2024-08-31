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
class ReviewModel {
    static getApiReview(api_id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(api_id);
            try {
                let reviews = yield prisma_1.prismaClientSingleton.api_entities.findUnique({
                    where: {
                        id: api_id
                    },
                    include: {
                        api_review_entities: {
                            include: {
                                user_entities: true
                            }
                        }
                    }
                });
                if (!(reviews === null || reviews === void 0 ? void 0 : reviews.api_review_entities.length)) {
                    return [];
                }
                reviews.api_review_entities.map((rev) => {
                    if (rev.user_entities) {
                        rev.name = rev.user_entities.username;
                        rev.imagePath = rev.user_entities.image;
                        delete rev.user_entities;
                    }
                });
                const jsonString = JSON.stringify(reviews.api_review_entities, (key, value) => typeof value == "bigint" ? value.toString() : value);
                return jsonString;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static addReview(user_id, api_id, review) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(user_id, api_id, review);
                yield prisma_1.prismaClientSingleton.api_review_entities.create({
                    data: {
                        comment: review.comment,
                        rating: review.rating,
                        user_entities: {
                            connect: {
                                id: user_id
                            }
                        },
                        api_entities: {
                            connect: {
                                id: api_id
                            }
                        }
                    }
                });
                // get new Rating 
                const newRating = yield prisma_1.prismaClientSingleton.api_review_entities.aggregate({
                    where: {
                        api_id
                    },
                    _avg: {
                        rating: true
                    }
                });
                // update api entity 
                yield prisma_1.prismaClientSingleton.api_entities.update({
                    where: {
                        id: api_id
                    },
                    data: {
                        rating: newRating._avg.rating
                    }
                });
                return true;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static reportAnComment(commentId, user_id, reason, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const succes = yield prisma_1.prismaClientSingleton.review_reports_entities.create({
                    data: {
                        description,
                        reason,
                        user_entities: {
                            connect: {
                                id: user_id
                            }
                        },
                        api_review_entities: {
                            connect: {
                                id: commentId
                            }
                        }
                    }
                });
                return true;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = ReviewModel;
