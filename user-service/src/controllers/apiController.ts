import { Response, NextFunction, Request } from "express";
import { AuthRequest } from "../types/auth-request";
import { SystemError, UserError } from "../utils/errorHandler";
import apiService from "../services/apiService";

export const likeApi = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const { api_id } = req.params;
    if (!api_id || !userId) {
      throw new SystemError("something went wrong !");
    }
    const response = await apiService.likeAPI(userId, Number(api_id));
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const dislikeApi = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { api_id } = req.params;
    const userId = req.userId;
    if (!userId || !api_id) {
      throw new SystemError("something went wrong");
    }

    const response = await apiService.dislikeAPI(userId, Number(api_id));
    res.status(200).json(response);
  } catch (error) {
    throw error;
  }
};

export const getAllApis = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, filter, search, status = 1 } = req.query;
    const { userId } = req.params;
    //console.log(req.query)
    // console.log(userId)
    if (!userId) {
      throw new UserError("missing user Id");
    }
    const response = await apiService.getAllApis(
      Number(userId),
      limit,
      page,
      search,
      Number(status) == 1 ? 1 : 0,

      Number(filter)
    );
    //console.log(response)
    return res.status(200).send(response);
  } catch (error: any) {
    console.log(error.message);
    next(error);
  }
};

export const getAPIReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { apiId } = req.params;
    if (!apiId) {
      throw new UserError("missing api ID !");
    }

    const reviews = await apiService.getApiReview(Number(apiId));
    res.status(200).send(reviews);
  } catch (error: any) {
    console.log(error.message);
    next(error);
  }
};

export const createReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { apiId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.userId;
    if (!apiId || !userId || !comment) {
      throw new UserError("something went wrong !");
    }

    await apiService.addReview(userId, Number(apiId), { rating, comment });
    res.status(201).send(true);
  } catch (error: any) {
    console.log(error.message);
    next(error);
  }
};

export const getAPIRating = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { apiId } = req.params;
    if (!apiId) {
      throw new UserError("something went wrong");
    }
    const response = await apiService.getAPIRating(Number(apiId));
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getAPISforAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { adminId } = req.params;
    const { page, limit, search } = req.query;
    if (!adminId) {
      throw new SystemError("something went wrong");
    }
    const apis = await apiService.getApisFoAdmin(
      Number(adminId),
      page,
      limit,
      search
    );
    res.status(200).send(apis);
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};

export const getProviderInfos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      throw new SystemError("something went wrong");
    }

    const apis = await apiService.getProviderInfos(Number(userId));
    res.status(200).json(apis);
  } catch (error) {
    next(error);
  }
};
export const getUserApis = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      throw new SystemError("something went wrong");
    }

    const apis = await apiService.getUserAPIS(Number(userId));
    res.status(200).send(apis);
  } catch (error) {
    next(error);
  }
};

export const getUserFollowingsApis = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      throw new SystemError("something went wrong");
    }

    const apis = await apiService.getUserFollowingsApis(Number(userId));
    res.status(200).send(apis);
  } catch (error) {
    next(error);
  }
};

export const reportAnAPI = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { apiId } = req.params;
    const { description, screenshots } = req.body;
    const userId = req.userId;
    if (!description || !apiId || !userId) {
      throw new SystemError("missing information");
    }

    await apiService.reportAnAPI(
      { description, screenshotsUrls: screenshots },
      Number(apiId),
      userId
    );
    res.status(201).send(true);
  } catch (error) {
    next(error);
  }
};

export const reportAnComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { commentId } = req.params;
    const { description, reason } = req.body;
    const userId = req.userId;
    if (!commentId || !reason || !userId) {
      throw new SystemError("missing information");
    }
    await apiService.reportAnComment(
      reason,
      description,
      userId,
      Number(commentId)
    );
    res.status(201).send(true);
  } catch (error) {
    next(error);
  }
};

export const getReportsForAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit, page, search } = req.query;
    const reports = await apiService.getReports(
      Number(limit),
      Number(page),
      search
    );
    res.status(200).send(reports);
  } catch (error: any) {
    console.log(error.message);
    next(error);
  }
};

export const getReviwesReports = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit, page, search } = req.query;
    const reports = await apiService.getReviewsReports(
      Number(limit),
      Number(page),
      search
    );
    res.status(200).send(reports);
  } catch (error: any) {
    next(error);
  }
};

export const deleteReportReview = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reportId } = req.params;
    console.log(reportId);
    await apiService.deleteReportReview(Number(reportId));
    res.status(200).send(true);
  } catch (error: any) {
    console.log(error.message);
    next(error);
  }
};

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await apiService.getCategories();
    //console.log(response)
    return res.status(200).json(response);
  } catch (error: any) {
    console.log(error.message);
    next(error);
  }
};

export const updateStatusApi = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("update status endpoint 1");

    const { id } = req.params;

    const x = await apiService.updateStatusApi(Number(id));
    console.log("update status endpoint 2", x);

    res.status(201).send(true);
  } catch (error) {
    console.log("update status endpoint 3", error);

    next(error);
  }
};

export const getAllApisIDNames = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await apiService.getAllApisIDNames();
    //console.log(response)
    return res.status(200).json(response);
  } catch (error: any) {
    console.log(error.message);
    next(error);
  }
};
