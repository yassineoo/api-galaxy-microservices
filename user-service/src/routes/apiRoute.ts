import express from "express";
import {
  createReview,
  deleteReportReview,
  dislikeApi,
  getAllApis,
  getAPIRating,
  getAPIReview,
  getAPISforAdmin,
  getCategories,
  getReportsForAdmin,
  getReviwesReports,
  getUserApis,
  getUserFollowingsApis,
  likeApi,
  reportAnAPI,
  reportAnComment,
} from "../controllers/apiController";

const userApiRouter = express.Router();
userApiRouter.get("/categories", getCategories);

userApiRouter.get("/reviewReports", getReviwesReports);
userApiRouter.get("/adminReports", getReportsForAdmin);
userApiRouter.get("/deleteReviewReport/:reportId", deleteReportReview);
userApiRouter.get("/:userId", getAllApis);
userApiRouter.post("/likeApi/:api_id", likeApi);
userApiRouter.post("/dislikeApi/:api_id", dislikeApi);
userApiRouter.get("/getReviews/:apiId", getAPIReview);
userApiRouter.post("/createReview/:apiId", createReview);
userApiRouter.get("/getRating/:apiId", getAPIRating);
userApiRouter.get("/admin/:adminId", getAPISforAdmin);
userApiRouter.get("/myApis/:userId", getUserApis);
userApiRouter.get("/myFollowingApis/:userId", getUserFollowingsApis);
userApiRouter.post("/reportAPI/:apiId", reportAnAPI);
userApiRouter.post("/reportComment/:commentId", reportAnComment);

// admin routes
export { userApiRouter };
