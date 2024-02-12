import { checkPassword, decodeEmailToken, generateAuthToken, generateEmailToken, hashPassword } from '../utils/token';
import userModel from '../models/userModel';
import profileModel from '../models/profileModel';
import { Role } from '../models/enum';
import { SendVerificationEmail, sendPasswordResetEmail, verifyPhoneNumber } from './grpcClient/notifService';
import { error } from 'console';
import userService from './UAMService';
import otpModel from '../models/otp';

require('dotenv').config();
const tokenSecret = process.env.TOKEN_SECRET;
const expiresIn = process.env.EXPIRES_IN;

const emailTokenSecret = process.env.EMAIL_TOKEN_SECRET;
const emailTokenExpiry = process.env.EMAIL_TOKEN_EXPIRY;

type register = {
    Username: string;
    Email: string;
    password: string;
    phoneNumber: string;
    FullName: string;
    DateOfBirth: string;
}

export default class authService {


    static register = async (data: register, role: Role) => {
        console.log(data);
        const userEmail = await userModel.getUserByEmail(data.Email);
        if (userEmail) {
            throw new Error('Email already exists');
        }
        const userPhoneNumber = await userModel.getUserByPhoneNumber(data.phoneNumber);
        if (userPhoneNumber) {
            throw new Error('Phone number already exists');
        }

        const hashedPassword = (await hashPassword(data.password)).toString();

        const user = await userModel.AddUser({
            Username: data.Username,
            Email: data.Email,
            PasswordHash: hashedPassword,
            PhoneNumber: data.phoneNumber,
            role: role
        });

        if (!user) {
            throw new Error('User could not be created');
        }

        const token = generateAuthToken(user.UserID, user.Email, tokenSecret || "", expiresIn || "");

        if (!token) {
            throw new Error('Token could not be generated');
        }

        const profile = profileModel.addProfile(
            user.UserID
            , {
                FullName: data.FullName,
                DateOfBirth: data.DateOfBirth,
            });

        if (!profile) {
            userModel.deleteUser(user.UserID);
            throw new Error('Profile could not be created');
        }

        return token;
    }

    static login = async (data: { Email: string, password: string }) => {
        const user = await userModel.getUserByEmail(data.Email);
        if (!user || !user.IsActive) {
            throw new Error('Email or password is incorrect ');
        }
        const dbHashedPassword = (await userModel.getHashedPassword(user.UserID))?.toString();

        const isMatch = await checkPassword(data.password, dbHashedPassword?.toString() || "");

        if (!isMatch) {
            throw new Error('Email or password is incorrect ');
        }


        const token = generateAuthToken(user.UserID, user.Email, tokenSecret || "", expiresIn || "");
        userModel.setLastLogin(user.UserID);

        if (user.IsTwoFactor && (user.PhoneNumber!=null)) {
            const randomNumber = Math.floor(1000 + Math.random() * 9000);
            verifyPhoneNumber({phoneNumber: user.PhoneNumber, otp: randomNumber.toString()});
            const otp = otpModel.addOtp(user.UserID,randomNumber);
        }

        return token;
    }

    static sendVerificationEmail = async (Email: string) => {
        const user = await userModel.getUserByEmail(Email);
        if (!user) {
            throw new Error("user doesn't exist ")
        }
        const token = generateEmailToken(Email, emailTokenSecret || "", emailTokenExpiry || "");
        const message = SendVerificationEmail({ email: Email, name: user.Username, token: token });
        return {
            token: token,
            message: message
        };
    }

    static sendPasswordResetEmail = async (Email: string) => {
        const user = await userModel.getUserByEmail(Email);
        if (!user) {
            throw new Error('Email does not exist');
        }
        const token = generateEmailToken(Email, emailTokenSecret || "", emailTokenExpiry || "");
        const message = sendPasswordResetEmail({ email: Email, name: user.Username, token: token });
        return {
            token: token,
            message: message
        };
    }

    static resendVerificationEmail = async (userId: number) => {
        const user = await userService.getUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return this.sendVerificationEmail(user.Email);
    }

    static verifyEmail = async (userId: number, token: string) => {
        const user = await userService.getUserById(userId);
        if (!user) {
            throw new Error("Unknown error");
        }
        const decodedToken = decodeEmailToken(token, emailTokenSecret || "");
        if ((!decodedToken) || (typeof decodedToken === 'string')) {
            throw new Error('Invalid token');
        }
        console.log({
            user: user.Email,
            decodedToken: decodedToken.email
        });
        if (user.Email === decodedToken.email) {
            userModel.updateUser(userId, { Verified: 1 });
            return true;
        }
    }




}