import LikeModel from "../models/likeModel";
import APIModel from "../models/ApiModel";
import { Review } from "../types/reviews";
import ReviewModel from "../models/reviewModel";
import { Report } from "../types/report";
import ReportModel from "../models/reportModel";
import ApiCategoryModel from "../models/ApiCategoryModel";
import userModel from "../models/userModel";
export default class apiService {
  static async likeAPI(user_id: number | bigint, api_id: number | bigint) {
    try {
      const res = await LikeModel.addLike(user_id, api_id);
      return res;
    } catch (error) {
      throw error;
    }
  }
  static async dislikeAPI(user_id: number | bigint, api_id: number | bigint) {
    try {
      const res = await LikeModel.dislikeApi(user_id, api_id);
      return res;
    } catch (error) {
      throw error;
    }
  }

  static async getAllApis(
    user_id: number,
    limit: any,
    page: any,
    search: any,
    filter?: number
  ) {
    try {
      const res = await APIModel.getAPIS(user_id, limit, page, search, filter);
      return res;
    } catch (error) {
      throw error;
    }
  }

  static async getCategories() {
    try {
      const res = await ApiCategoryModel.getCategories();
      //console.log(res)
      return res;
    } catch (error) {
      throw error;
    }
  }

  static async getApiReview(api_id: number) {
    try {
      const api_reviews = await ReviewModel.getApiReview(api_id);
      return api_reviews;
    } catch (error) {
      throw error;
    }
  }

  static async addReview(user_id: number, api_id: number, review: Review) {
    try {
      const res = await ReviewModel.addReview(user_id, api_id, review);
      return true;
    } catch (error) {
      throw error;
    }
  }
  static async getAPIRating(api_id: number) {
    try {
      const rating = await APIModel.getAPIRating(api_id);
      return rating;
    } catch (error) {
      throw error;
    }
  }
  static async getApisFoAdmin(
    admin_id: number,
    page: any,
    limit: any,
    search: any
  ) {
    try {
      const apis = await APIModel.getAPIListForAdmin(
        admin_id,
        page,
        limit,
        search
      );
      return apis;
    } catch (error) {
      throw error;
    }
  }

  static async getUserAPIS(userId: number) {
    try {
      const userApis = await APIModel.getAPISForUser(userId);
      return userApis;
    } catch (error) {
      throw error;
    }
  }
  static async getProviderInfos(userId: number) {
    try {
      const userApis = await userModel.getProviderInfos(userId);
      const jsonString = JSON.stringify(userApis, (key, value) =>
        typeof value == "bigint" ? value.toString() : value
      );
      return jsonString;
    } catch (error) {
      throw error;
    }
  }

  static async getUserFollowingsApis(user_id: number) {
    try {
      const fapis = await APIModel.getUserFollowingApis(user_id);
      return fapis;
    } catch (error) {
      throw error;
    }
  }

  static async reportAnAPI(report: Report, api_id: number, user_id: number) {
    try {
      await ReportModel.addReport(report, user_id, api_id);
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async updateStatusApi(api_id: number) {
    try {
      await APIModel.updateStatus(api_id);
      return true;
    } catch (error) {
      throw error;
    }
  }
  static async reportAnComment(
    reason: string,
    description: string,
    user_id: number,
    comment_id: number
  ) {
    try {
      const success = await ReviewModel.reportAnComment(
        comment_id,
        user_id,
        reason,
        description
      );
      return success;
    } catch (error) {
      throw error;
    }
  }

  static async getReports(limit: any, page: any, search: any) {
    try {
      const reports = await ReportModel.getReports(limit, page, search);
      return reports;
    } catch (error) {
      throw error;
    }
  }

  static async getReviewsReports(limit: any, page: any, search: any) {
    try {
      const reports = await ReportModel.getReviewReports(limit, page, search);
      return reports;
    } catch (error) {
      throw error;
    }
  }

  static async deleteReportReview(id: number) {
    try {
      await ReportModel.deleteReviewReport(id);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
