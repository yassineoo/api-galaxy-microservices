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
class ReportModel {
    static addReport(report, user_id, api_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma_1.prismaClientSingleton.api_report_entities.create({
                    data: {
                        description: report.description,
                        screenshots: report.screenshotsUrls,
                        api_entities: {
                            connect: {
                                id: api_id
                            }
                        },
                        user_entities: {
                            connect: {
                                id: user_id
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
    static getReports(limit_1, page_1) {
        return __awaiter(this, arguments, void 0, function* (limit, page, search = "") {
            try {
                console.log(limit, page);
                const whereConditions = {};
                if (search) {
                    whereConditions.description =
                        {
                            contains: search,
                            mode: "insensitive"
                        };
                }
                const reports = yield prisma_1.prismaClientSingleton.api_report_entities.findMany({
                    where: whereConditions,
                    include: {
                        api_entities: {
                            select: {
                                name: true
                            }
                        }
                    },
                    skip: (page - 1) * limit,
                    take: limit
                });
                const flattenedReport = reports.map((report) => flattenObject(report));
                const finalReports = JSON.stringify(flattenedReport, (key, value) => typeof (value) == "bigint" ? value.toString() : value);
                return finalReports;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getReviewReports(limit_1, page_1) {
        return __awaiter(this, arguments, void 0, function* (limit, page, search = "") {
            try {
                const whereConditions = {};
                if (search) {
                    whereConditions.OR = [
                        {
                            reason: {
                                contains: search,
                                mode: "insensitive"
                            }
                        },
                        { description: {
                                contains: search,
                                mode: "insensitive"
                            } }
                    ];
                }
                const reportReviews = yield prisma_1.prismaClientSingleton.review_reports_entities.findMany({
                    where: whereConditions,
                    include: {
                        api_review_entities: {
                            select: {
                                comment: true,
                                user_entities: {
                                    select: {
                                        username: true
                                    }
                                }
                            }
                        }
                    },
                    skip: (page - 1) * limit,
                    take: limit
                });
                const flattenedReport = reportReviews.map((report) => flattenObject(report));
                const jsonString = JSON.stringify(flattenedReport, (key, value) => typeof (value) == "bigint" ? value.toString() : value);
                return jsonString;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static deleteReviewReport(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isDeleted = yield prisma_1.prismaClientSingleton.review_reports_entities.delete({
                    where: {
                        id: id
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
exports.default = ReportModel;
function flattenObject(obj, res = {}) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                flattenObject(obj[key], res);
            }
            else {
                res[key] = obj[key];
            }
        }
    }
    return res;
}
