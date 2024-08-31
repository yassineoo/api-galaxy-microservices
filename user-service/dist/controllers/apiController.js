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
exports.deleteReportReview = exports.getReviwesReports = exports.getReportsForAdmin = exports.reportAnComment = exports.reportAnAPI = exports.getUserFollowingsApis = exports.getUserApis = exports.getAPISforAdmin = exports.getAPIRating = exports.createReview = exports.getAPIReview = exports.getAllApis = exports.dislikeApi = exports.likeApi = void 0;
const errorHandler_1 = require("../utils/errorHandler");
const apiService_1 = __importDefault(require("../services/apiService"));
const likeApi = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { api_id } = req.params;
        if (!api_id || !userId) {
            throw new errorHandler_1.SystemError("something went wrong !");
        }
        const response = yield apiService_1.default.likeAPI(userId, Number(api_id));
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.likeApi = likeApi;
const dislikeApi = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { api_id } = req.params;
        const userId = req.userId;
        if (!userId || !api_id) {
            throw new errorHandler_1.SystemError("something went wrong");
        }
        const response = yield apiService_1.default.dislikeAPI(userId, Number(api_id));
        res.status(200).json(response);
    }
    catch (error) {
        throw error;
    }
});
exports.dislikeApi = dislikeApi;
const getAllApis = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit, filter, search } = req.query;
        const { userId } = req.params;
        //console.log(req.query)
        // console.log(userId)
        if (!userId) {
            throw new errorHandler_1.UserError("missing user Id");
        }
        const response = yield apiService_1.default.getAllApis(Number(userId), limit, page, search);
        //console.log(response)
        return res.status(200).send(response);
    }
    catch (error) {
        console.log(error.message);
        next(error);
    }
});
exports.getAllApis = getAllApis;
const getAPIReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { apiId } = req.params;
        if (!apiId) {
            throw new errorHandler_1.UserError("missing api ID !");
        }
        const reviews = yield apiService_1.default.getApiReview(Number(apiId));
        res.status(200).send(reviews);
    }
    catch (error) {
        console.log(error.message);
        next(error);
    }
});
exports.getAPIReview = getAPIReview;
const createReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { apiId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.userId;
        if (!apiId || !userId || !comment) {
            throw new errorHandler_1.UserError("something went wrong !");
        }
        yield apiService_1.default.addReview(userId, Number(apiId), { rating, comment });
        res.status(201).send(true);
    }
    catch (error) {
        console.log(error.message);
        next(error);
    }
});
exports.createReview = createReview;
const getAPIRating = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { apiId } = req.params;
        if (!apiId) {
            throw new errorHandler_1.UserError("something went wrong");
        }
        const response = yield apiService_1.default.getAPIRating(Number(apiId));
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.getAPIRating = getAPIRating;
const getAPISforAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminId } = req.params;
        const { page, limit, search } = req.query;
        if (!adminId) {
            throw new errorHandler_1.SystemError("something went wrong");
        }
        const apis = yield apiService_1.default.getApisFoAdmin(Number(adminId), page, limit, search);
        res.status(200).send(apis);
    }
    catch (error) {
        console.log(error.message);
        next(error);
    }
});
exports.getAPISforAdmin = getAPISforAdmin;
const getUserApis = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            throw new errorHandler_1.SystemError("something went wrong");
        }
        const apis = yield apiService_1.default.getUserAPIS(Number(userId));
        res.status(200).send(apis);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserApis = getUserApis;
const getUserFollowingsApis = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            throw new errorHandler_1.SystemError("something went wrong");
        }
        const apis = yield apiService_1.default.getUserFollowingsApis(Number(userId));
        res.status(200).send(apis);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserFollowingsApis = getUserFollowingsApis;
const reportAnAPI = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { apiId } = req.params;
        const { description, screenshots } = req.body;
        const userId = req.userId;
        if (!description || !apiId || !userId) {
            throw new errorHandler_1.SystemError("missing information");
        }
        yield apiService_1.default.reportAnAPI({ description, screenshotsUrls: screenshots }, Number(apiId), userId);
        res.status(201).send(true);
    }
    catch (error) {
        next(error);
    }
});
exports.reportAnAPI = reportAnAPI;
const reportAnComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { commentId } = req.params;
        const { description, reason } = req.body;
        const userId = req.userId;
        if (!commentId || !reason || !userId) {
            throw new errorHandler_1.SystemError("missing information");
        }
        yield apiService_1.default.reportAnComment(reason, description, userId, Number(commentId));
        res.status(201).send(true);
    }
    catch (error) {
        next(error);
    }
});
exports.reportAnComment = reportAnComment;
const getReportsForAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit, page, search } = req.query;
        const reports = yield apiService_1.default.getReports(Number(limit), Number(page), search);
        res.status(200).send(reports);
    }
    catch (error) {
        console.log(error.message);
        next(error);
    }
});
exports.getReportsForAdmin = getReportsForAdmin;
const getReviwesReports = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit, page, search } = req.query;
        const reports = yield apiService_1.default.getReviewsReports(Number(limit), Number(page), search);
        res.status(200).send(reports);
    }
    catch (error) {
        next(error);
    }
});
exports.getReviwesReports = getReviwesReports;
const deleteReportReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reportId } = req.params;
        console.log(reportId);
        yield apiService_1.default.deleteReportReview(Number(reportId));
        res.status(200).send(true);
    }
    catch (error) {
        console.log(error.message);
        next(error);
    }
});
exports.deleteReportReview = deleteReportReview;
