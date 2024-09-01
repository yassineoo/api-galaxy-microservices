import { Router } from "express";
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
import authenticate from "../services/middlewares/authenticate.middleware";

const userApiRouter = Router();
userApiRouter.get("/categories", getCategories);
userApiRouter.get("/:userId", getAllApis);
userApiRouter.get("/getReviews/:apiId", getAPIReview);
userApiRouter.get("/adminReports", getReportsForAdmin);
userApiRouter.get("/myApis/:userId", getUserApis);
userApiRouter.get("/getRating/:apiId", getAPIRating);

userApiRouter.get("/myFollowingApis/:userId", getUserFollowingsApis);
userApiRouter.use(authenticate);

userApiRouter.get("/deleteReviewReport/:reportId", deleteReportReview);
userApiRouter.post("/likeApi/:api_id", likeApi);
userApiRouter.post("/dislikeApi/:api_id", dislikeApi);
userApiRouter.post("/createReview/:apiId", createReview);
userApiRouter.get("/admin/:adminId", getAPISforAdmin);

userApiRouter.post("/reportAPI/:apiId", reportAnAPI);
userApiRouter.post("/reportComment/:commentId", reportAnComment);

export { userApiRouter };
