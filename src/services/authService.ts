import {
  checkPassword,
  decodeEmailToken,
  generateEmailToken,
  hashPassword,
} from '../utils/token';
import userModel from '../models/userModel';
import { Role } from '../models/enum';
import {
  SendVerificationEmail,
  sendPasswordResetEmail,
  verifyPhoneNumber,
} from './grpcClient/notifService';
import userService from './UAMService';
import { sendEMail } from '../utils/email';
import otpModel from '../models/otp';

require('dotenv').config();
const emailTokenSecret = process.env.EMAIL_TOKEN_SECRET;
const emailTokenExpiry = process.env.EMAIL_TOKEN_EXPIRY;

type register = {
  Username: string;
  Email: string;
  password: string;
  phoneNumber: string;
  FullName: string;
  DateOfBirth: string;
};

export default class authService {
  static register = async (data: register, role: Role) => {
    try {
      const userEmail = await userModel.getUserByEmail(data.Email);
      if (userEmail) {
        throw new Error('Email already exists');
      }
      /*const userPhoneNumber = await userModel.getUserByPhoneNumber(data.phoneNumber);
        if (userPhoneNumber) {
            throw new Error('Phone number already exists');
        }*/
      const hashedPassword = (await hashPassword(data.password)).toString();
      const user = await userModel.AddUser({
        Username: data.Username,
        Email: data.Email,
        PasswordHash: hashedPassword,
        PhoneNumber: data.phoneNumber,
        role: role,
      });

      if (!user) {
        throw new Error('User could not be created');
      }

      /*const token = generateAuthToken(user.UserID, user.Email, tokenSecret || "", expiresIn || "");

        if (!token) {
            throw new Error('Token could not be generated');
        }

        const profile = profileModel.addProfile(
            user.UserID
            , {
                FullName: data.FullName,
                DateOfBirth: data.DateOfBirth || "",
            });

        if (!profile) {
            userModel.deleteUser(user.UserID);
            throw new Error('Profile could not be created');
        }

        return token;*/
      //send confirmation Mail
      const token = generateEmailToken(
        user.Email,
        emailTokenSecret || '',
        emailTokenExpiry || ''
      );

      const redirect_url = `http://localhost:3000/confirmRegistration?token=${token}`;
      sendEMail('confirmation of registration', redirect_url, user.Email);

      return {
        id: user.UserID,
      };
    } catch (error: any) {
      return {
        message: error.message,
      };
    }
  };

  static login = async (data: { Email: string; password: string }) => {
    try {
      const user = await userModel.getUserByEmail(data.Email);
      if (!user || !user.IsActive) {
        throw new Error('Email or password is incorrect ');
      }
      const dbHashedPassword = (
        await userModel.getHashedPassword(user.UserID)
      )?.toString();

      const isMatch = await checkPassword(
        data.password,
        dbHashedPassword?.toString() || ''
      );

      if (!isMatch) {
        throw new Error('Email or password is incorrect ');
      }

      /* if (user.IsTwoFactor && (user.PhoneNumber!=null)) {
            const randomNumber = Math.floor(1000 + Math.random() * 9000);
            verifyPhoneNumber({phoneNumber: user.PhoneNumber, otp: randomNumber.toString()});
            const otp = otpModel.addOtp(user.UserID,randomNumber);
        }
*/
      return {
        email: user?.Email,
        name: user?.Username,
        id: user?.UserID,
        verified: user?.Verified,
      };
    } catch (error: any) {
      return {
        message: error.message,
      };
    }
  };

  static OathUser = async (data: {
    Email: string;
    Username: string;
    role: string;
  }) => {
    let user;
    try {
      user = await userModel.getUserByEmail(data.Email);
      if (!user || !user.IsActive) {
        user = await userModel.AddUser({
          Username: data.Username,
          Email: data.Email,
          role: data.role,
        });
        userModel.updateUser(user.UserID, { Verified: 1 });
      }

      /*const token = generateAuthToken(user?.UserID, user?.Email!, tokenSecret || "", expiresIn || "");
        userModel.setLastLogin(user?.UserID!);*/
      return {
        email: user?.Email,
        name: user?.Username,
        userId: user?.UserID,
        verified: user?.Verified,
      };
    } catch (error: any) {
      return {
        message: error.message,
      };
    }
  };

  static getSession = async (data: { email: string }) => {
    let user = await userModel.getUserByEmail(data.email);
    return {
      email: user?.Email,
      name: user?.Username,
      id: user?.UserID,
      verified: user?.Verified,
    };
  };

  static sendVerificationEmail = async (Email: string) => {
    const user = await userModel.getUserByEmail(Email);
    if (!user) {
      throw new Error("user doesn't exist ");
    }
    const token = generateEmailToken(
      Email,
      emailTokenSecret || '',
      emailTokenExpiry || ''
    );
    const message = SendVerificationEmail({
      email: Email,
      name: user.Username,
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
      throw new Error('Email does not exist');
    }
    const token = generateEmailToken(
      Email,
      emailTokenSecret || '',
      emailTokenExpiry || ''
    );
    const message = sendPasswordResetEmail({
      email: Email,
      name: user.Username,
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
      throw new Error('User not found');
    }
    return this.sendVerificationEmail(user.Email);
  };

  static verifyEmail = async (
    userId: number,
    data: any,
    isEmailProvided: boolean
  ) => {
    try {
      const user = await userService.getUserById(userId);
      if (!user) {
        throw new Error('Unknown error');
      }
      if (isEmailProvided) {
        console.log('called');
        if (user.Email == data.email) {
          return true;
        } else {
          throw new Error('Unknown email');
        }
      } else {
        const decodedToken = decodeEmailToken(data, emailTokenSecret || '');
        if (!decodedToken || typeof decodedToken === 'string') {
          throw new Error('Invalid token');
        }
        if (user.Email === decodedToken.email) {
          await userModel.updateUser(userId, { Verified: true });
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
}
