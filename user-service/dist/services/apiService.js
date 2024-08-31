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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const likeModel_1 = __importDefault(require("../models/likeModel"));
const ApiModel_1 = __importDefault(require("../models/ApiModel"));
const reviewModel_1 = __importDefault(require("../models/reviewModel"));
const reportModel_1 = __importDefault(require("../models/reportModel"));
class apiService {
    static likeAPI(user_id, api_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield likeModel_1.default.addLike(user_id, api_id);
                return res;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static dislikeAPI(user_id, api_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield likeModel_1.default.dislikeApi(user_id, api_id);
                return res;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getAllApis(user_id, limit, page, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield ApiModel_1.default.getAPIS(user_id, limit, page, search);
                //console.log(res)
                return res;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getApiReview(api_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const api_reviews = yield reviewModel_1.default.getApiReview(api_id);
                return api_reviews;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static addReview(user_id, api_id, review) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield reviewModel_1.default.addReview(user_id, api_id, review);
                return true;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getAPIRating(api_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rating = yield ApiModel_1.default.getAPIRating(api_id);
                return rating;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getApisFoAdmin(admin_id, page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apis = yield ApiModel_1.default.getAPIListForAdmin(admin_id, page, limit, search);
                return apis;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getUserAPIS(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userApis = yield ApiModel_1.default.getAPISForUser(userId);
                return userApis;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getUserFollowingsApis(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fapis = yield ApiModel_1.default.getUserFollowingApis(user_id);
                return fapis;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static reportAnAPI(report, api_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield reportModel_1.default.addReport(report, user_id, api_id);
                return true;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static reportAnComment(reason, description, user_id, comment_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const success = yield reviewModel_1.default.reportAnComment(comment_id, user_id, reason, description);
                return success;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getReports(limit, page, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reports = yield reportModel_1.default.getReports(limit, page, search);
                return reports;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getReviewsReports(limit, page, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reports = yield reportModel_1.default.getReviewReports(limit, page, search);
                return reports;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static deleteReportReview(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield reportModel_1.default.deleteReviewReport(id);
                return true;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = apiService;
