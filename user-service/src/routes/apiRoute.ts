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
  getProviderInfos,
  getReportsForAdmin,
  getReviwesReports,
  getUserApis,
  getUserFollowingsApis,
  likeApi,
  reportAnAPI,
  reportAnComment,
  updateStatusApi,
} from "../controllers/apiController";
import authenticate from "../services/middlewares/authenticate.middleware";
import { getUserNotifications } from "../controllers/notifController";

const userApiRouter = Router();
userApiRouter.post("/update-status/:id", updateStatusApi);
userApiRouter.get("/notifications/:id", getUserNotifications);
userApiRouter.get("/categories", getCategories);
userApiRouter.get("/:userId", getAllApis);
userApiRouter.get("/getReviews/:apiId", getAPIReview);
userApiRouter.get("/adminReports", getReportsForAdmin);
userApiRouter.get("/adminReviwesReports", getReviwesReports);
userApiRouter.get("/myApis/:userId", getUserApis);
userApiRouter.get("/provider/:userId", getProviderInfos);
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
