import {
  checkPassword,
  decodeEmailToken,
  generateAuthToken,
  generateEmailToken,
  hashPassword,
} from "../utils/token";
import userModel from "../models/userModel";
import { Role } from "../models/enum";
import {
  SendVerificationEmail,
  sendPasswordResetEmail,
} from "./grpcClient/notifService";
import userService from "./UAMService";
import { sendEMail } from "../utils/email";
import userVerification from "../models/userVerification";
import env from "../utils/env";
import { ENV } from "./../utils/env";
require("dotenv").config();
const emailTokenSecret = process.env.EMAIL_TOKEN_SECRET;
const emailTokenExpiry = process.env.EMAIL_TOKEN_EXPIRY;

interface IRegisterInput {
  username: string;
  email: string;
  password: string;
}

class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = Number(statusCode) || 500;
  }
}

export default class authService {
  static register = async (data: IRegisterInput, role: Role) => {
    try {
      const { email, password, username } = data;
      const userEmail = await userModel.getUserByEmail(email);
      if (userEmail) {
        throw new ApiError("Email already exists", 409);
      }

      const hashedPassword = await hashPassword(password);
      const user = await userModel.AddUser({
        Username: username,
        Email: email,
        PasswordHash: hashedPassword,
        role: role,
      });

      if (!user) {
        throw new ApiError("User could not be created", 500);
      }

      // Send confirmation email
      const token = generateEmailToken(
        user.email,
        Number(user.id),
        emailTokenSecret || "",
        emailTokenExpiry || ""
      );
      const redirect_url = `http://localhost:3000/confirmRegistration?token=${token}`;
      sendEMail("confirmation of registration", redirect_url, user.email);

      return { id: user.id.toString(), message: "User created successfully" };
    } catch (error: any) {
      console.log({ error });
      throw error;
    }
  };
  static login = async (data: { email: string; password: string }) => {
    try {
      console.log("called");
      const user = await userModel.getUserByEmail(data.email);
      if (!user || !user.is_active) {
        throw new Error("Email or password is incorrect");
      }
      const dbHashedPassword = (
        await userModel.getHashedPassword(Number(user.id))
      )?.toString();

      const isMatch = await checkPassword(
        data.password,
        dbHashedPassword?.toString() || ""
      );
      console.log(isMatch);
      if (!isMatch) {
        throw new Error("Email or password is incorrect");
      }

      // Generate the token
      const tokenSecret = ENV.JWT_SECRET; // Replace with your actual secret key
      const tokenExpiry = ENV.JWT_EXPIRATION; // Replace with your desired token expiry time
      const { token, expiry } = await generateAuthToken(
        Number(user.id),
        user.email,
        tokenSecret,
        tokenExpiry
      );

      // send a otp to his mail
      const otp = Math.floor(1000 + Math.random() * 9000);
      const message = `
      Hi ${user.username},

We noticed a login attempt to your account from a new device or location.

To complete your sign-in, please enter the verification code below:

${otp}

This code is valid for the next 10 minutes. If you did not attempt to log in, please secure your account immediately by resetting your password.

If you have any questions or need assistance, our support team is here to help.

Thank you for using our application,
The Galaxy Team
      `;
      await sendEMail(
        "Your application Login Verification Code",
        message,
        user.email
      );
      await userVerification.addVerification(
        +user.id.toString(),
        otp.toString()
      );
      return {
        email: user?.email,
        username: user?.username,
        userId: user.id.toString(),
        verified: user.verified,
        twoFactorEnabled: user.is_two_factor,
        token,
        tokenExpiry: expiry,
      };
    } catch (error: any) {
      throw error;
    }
  };

  static OathUser = async (data: {
    Email: string;
    Username: string;
    role: string;
    image: string;
  }) => {
    let user;
    try {
      user = await userModel.getUserByEmail(data.Email);
      /*console.log("=======================");

      console.log(user);
      console.log("=======================");
*/
      if (!user || !user.is_active) {
        user = await userModel.AddUser({
          Username: data.Username,
          Email: data.Email,
          role: data.role || "Client",
          Image: data.image,
        });
        userModel.updateUser(Number(user.id), { verified: true });
      }
      // Generate the token

      const tokenSecret = "your_secret_key"; // Replace with your actual secret key
      const tokenExpiry = "1h"; // Replace with your desired token expiry time
      //console.log( "number is :",Number(user.id))
      const token = generateAuthToken(
        Number(user.id),
        user.email,
        tokenSecret || "",
        tokenExpiry || ""
      );
      userModel.setLastLogin(Number(user?.id)!);
      // send a otp to his mail
      const otp = Math.floor(1000 + Math.random() * 9000);
      const message = `
       Hi ${user.username},
 
 We noticed a login attempt to your account from a new device or location.
 
 To complete your sign-in, please enter the verification code below:
 
 ${otp}
 
 This code is valid for the next 10 minutes. If you did not attempt to log in, please secure your account immediately by resetting your password.
 
 If you have any questions or need assistance, our support team is here to help.
 
 Thank you for using our application,
 The Galaxy Team
       `;
      await sendEMail(
        "Your application Login Verification Code",
        message,
        user.email
      );
      await userVerification.addVerification(
        +user.id.toString(),
        otp.toString()
      );
      return {
        Email: user?.email,
        Name: user?.username,
        userId: Number(user?.id),
        token,
        twoFactorEnabled: user.is_two_factor,
        tokenExpiry,
      };
    } catch (error: any) {
      throw error;
    }
  };

  static getSession = async (data: { email: string }) => {
    let user = await userModel.getUserByEmail(data.email);
    return {
      email: user?.email,
      name: user?.username,
      id: user?.id,
      verified: user?.verified,
    };
  };

  static sendVerificationEmail = async (Email: string) => {
    const user = await userModel.getUserByEmail(Email);
    if (!user) {
      throw new Error("user doesn't exist ");
    }
    const token = generateEmailToken(
      Email,
      Number(user.id),
      emailTokenSecret || "",
      emailTokenExpiry || ""
    );
    const message = SendVerificationEmail({
      email: Email,
      name: user.username,
      token: token,
    });
    return {
      token: token,
      message: message,
    };
  };

  static sendPasswordResetEmail = async (Email: string) => {
    const user = await userModel.getUserByEmail(Email);
    if (!user) {
      throw new Error("Email does not exist");
    }
    const token = generateEmailToken(
      Email,
      Number(user.id),
      emailTokenSecret || "",
      emailTokenExpiry || ""
    );
    const message = sendPasswordResetEmail({
      email: Email,
      name: user.username,
      token: token,
    });
    return {
      token: token,
      message: message,
    };
  };

  static resendVerificationEmail = async (userId: number) => {
    const user = await userService.getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return this.sendVerificationEmail(user.email);
  };

  static verifyEmail = async (data: any, isEmailProvided: boolean) => {
    try {
      if (isEmailProvided) {
        const user = await userModel.getUserByEmail(data.email);
        if (!user) {
          throw new Error("Unknown email");
        }
        return true;
      } else {
        const decodedToken = decodeEmailToken(data, emailTokenSecret || "");
        if (!decodedToken || typeof decodedToken === "string") {
          throw new Error("Invalid token");
        }
        const user = await userService.getUserById(decodedToken.id);
        if (!user) {
          throw new Error("Unknown error");
        }
        if (user.email === decodedToken.email) {
          await userModel.updateUser(decodedToken.id, { verified: true });
          return true;
        }
        return false;
      }
    } catch (error: any) {
      return {
        message: error.message,
      };
    }
  };

  static resetUserPassword = async (data: any, userId: number) => {
    try {
      const hashedPassword = (await hashPassword(data.pass)).toString();
      await userModel.updateUser(userId, {
        PasswordHash: hashedPassword,
      });
      return true;
    } catch (error: any) {
      return {
        message: error.message,
      };
    }
  };
  static async activateTwoFactors(userId: string) {
    try {
      const user = await userModel.getUserById(+userId);
      await userModel.updateUser(+userId, {
        is_two_factor: !user?.is_two_factor,
      });
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async verifyOTP(userId: number, otp: string) {
    try {
      const userverification = (await userVerification.getUserVerification(
        userId
      )) as any;
      console.log("user id", userId);
      if (!userverification) {
        throw new Error("no verification found");
      }
      if (userverification?.id) {
        const otpExpired =
          new Date(userverification.expired).getTime() < Date.now();
        if (otpExpired) {
          console.log("called 2");
          await userVerification.deleteUserVerification(userId);
          throw new Error("OTP expired");
        }
        console.log(userverification);
        const isEqual = userverification.otp == otp;
        if (isEqual) {
          //delete from db
          await userVerification.deleteUserVerification(userId);
          /*await userModel.updateUser(userId, {
            verified: true,
          });*/
          return true;
        } else {
          //console.log("wiii")
          throw new Error("OTP entered is wrong");
        }
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
}
