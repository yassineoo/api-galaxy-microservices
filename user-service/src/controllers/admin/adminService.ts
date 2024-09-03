import { Request, Response, NextFunction } from "express";
import AdminService from "../../services/adminService";
import { UserError } from "../../utils/errorHandler";
import { scheduelEarningPercentage } from "../../utils/admin";
// import connect producer and send Message
import { connectProducer, sendMessage, getRandomKey } from "../../utils/kafka";

connectProducer();

export const getUserList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const settings = await AdminService.getUserList();
    res.status(200).send(settings);
  } catch (error) {
    next(error);
  }
};

export const updateEarningPercentage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { earning_percentage, adminId } = req.body;
    if (!earning_percentage) {
      throw new UserError("missing earning percentage !");
    }
    await scheduelEarningPercentage(earning_percentage, adminId);
    // produce a message to kafka service
    const randomKey = getRandomKey();
    await sendMessage(
      "update-earning-percentage",
      randomKey,
      `${earning_percentage}`
    );
    return res.status(200).send(true);
  } catch (error: any) {
    console.log(error.message);
    next(error);
  }
};

export const updateTermsAndConditions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { termsAndConditions, adminId } = req.body;
    if (!termsAndConditions) {
      throw new UserError("missing Terms and conditions !");
    }
    const response = await AdminService.updateTermsAndConditions(
      termsAndConditions,
      adminId
    );
    // notify users
    const randomKey = getRandomKey();
    await sendMessage("update-terms-conditions", randomKey, termsAndConditions);
    return res.status(200).send(response);
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const updatePrivacyAndPolicy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { privacyAndPolicy, adminId } = req.body;
    if (!privacyAndPolicy) {
      throw new UserError("missing privacy and policy !");
    }
    const response = await AdminService.updatePolicyAndPrivacy(
      privacyAndPolicy,
      adminId
    );
    const randomKey = getRandomKey();
    await sendMessage("update-privacy-policy", randomKey, privacyAndPolicy);
    return res.status(200).send(response);
  } catch (error: any) {
    console.log(error.message);
    next(error);
  }
};

export const publishAnAPI = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { api_id } = req.body;
    if (!api_id) {
      throw new UserError("missing api_information !");
    }
    const api: any = await AdminService.publishAnAPI(api_id);
    // notify users
    const randomKey = getRandomKey();
    await sendMessage(
      "publish-API",
      randomKey,
      `a new api ${api.name} has been launched`
    );
    return res.status(200).send(true);
  } catch (error) {
    next(error);
  }
};

export const getAdminSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const settings = await AdminService.getAdminSettings();
    res.status(200).send(settings);
  } catch (error) {
    next(error);
  }
};

export const getInactiveAPIS = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const response = await AdminService.getInactiveAPIS();
    console.log(response);
    res.status(200).send(response);
  } catch (error) {
    throw error;
  }
};
