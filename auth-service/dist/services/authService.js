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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("../utils/token");
const userModel_1 = __importDefault(require("../models/userModel"));
const notifService_1 = require("./grpcClient/notifService");
const UAMService_1 = __importDefault(require("./UAMService"));
const email_1 = require("../utils/email");
const userVerification_1 = __importDefault(require("../models/userVerification"));
const env_1 = require("./../utils/env");
require("dotenv").config();
const emailTokenSecret = process.env.EMAIL_TOKEN_SECRET;
const emailTokenExpiry = process.env.EMAIL_TOKEN_EXPIRY;
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = Number(statusCode) || 500;
    }
}
class authService {
    static activateTwoFactors(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.default.getUserById(+userId);
                yield userModel_1.default.updateUser(+userId, {
                    is_two_factor: !(user === null || user === void 0 ? void 0 : user.is_two_factor),
                });
                return true;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static verifyOTP(userId, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userverification = (yield userVerification_1.default.getUserVerification(userId));
                console.log("user id", userId);
                if (!userverification) {
                    throw new Error("no verification found");
                }
                if (userverification === null || userverification === void 0 ? void 0 : userverification.id) {
                    const otpExpired = new Date(userverification.expired).getTime() < Date.now();
                    if (otpExpired) {
                        console.log("called 2");
                        yield userVerification_1.default.deleteUserVerification(userId);
                        throw new Error("OTP expired");
                    }
                    console.log(userverification);
                    const isEqual = userverification.otp == otp;
                    if (isEqual) {
                        //delete from db
                        yield userVerification_1.default.deleteUserVerification(userId);
                        /*await userModel.updateUser(userId, {
                          verified: true,
                        });*/
                        return true;
                    }
                    else {
                        //console.log("wiii")
                        throw new Error("OTP entered is wrong");
                    }
                }
                return true;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
_a = authService;
authService.register = (data, role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, username } = data;
        const userEmail = yield userModel_1.default.getUserByEmail(email);
        if (userEmail) {
            throw new ApiError("Email already exists", 409);
        }
        const hashedPassword = yield (0, token_1.hashPassword)(password);
        const user = yield userModel_1.default.AddUser({
            Username: username,
            Email: email,
            PasswordHash: hashedPassword,
            role: role,
        });
        if (!user) {
            throw new ApiError("User could not be created", 500);
        }
        // Send confirmation email
        const token = (0, token_1.generateEmailToken)(user.email, Number(user.id), emailTokenSecret || "", emailTokenExpiry || "");
        const redirect_url = `http://localhost:3000/confirmRegistration?token=${token}`;
        (0, email_1.sendEMail)("confirmation of registration", redirect_url, user.email);
        return { id: user.id.toString(), message: "User created successfully" };
    }
    catch (error) {
        console.log({ error });
        throw error;
    }
});
authService.login = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        console.log("called");
        const user = yield userModel_1.default.getUserByEmail(data.email);
        if (!user || !user.is_active) {
            throw new Error("Email or password is incorrect");
        }
        const dbHashedPassword = (_b = (yield userModel_1.default.getHashedPassword(Number(user.id)))) === null || _b === void 0 ? void 0 : _b.toString();
        const isMatch = yield (0, token_1.checkPassword)(data.password, (dbHashedPassword === null || dbHashedPassword === void 0 ? void 0 : dbHashedPassword.toString()) || "");
        console.log(isMatch);
        if (!isMatch) {
            throw new Error("Email or password is incorrect");
        }
        // Generate the token
        const tokenSecret = env_1.ENV.JWT_SECRET; // Replace with your actual secret key
        const tokenExpiry = env_1.ENV.JWT_EXPIRATION; // Replace with your desired token expiry time
        const { token, expiry } = yield (0, token_1.generateAuthToken)(Number(user.id), user.email, tokenSecret, tokenExpiry);
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
        yield (0, email_1.sendEMail)("Your application Login Verification Code", message, user.email);
        yield userVerification_1.default.addVerification(+user.id.toString(), otp.toString());
        return {
            email: user === null || user === void 0 ? void 0 : user.email,
            username: user === null || user === void 0 ? void 0 : user.username,
            userId: user.id.toString(),
            verified: user.verified,
            twoFactorEnabled: user.is_two_factor,
            token,
            tokenExpiry: expiry,
            role: user.role,
        };
    }
    catch (error) {
        throw error;
    }
});
authService.OathUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    try {
        user = yield userModel_1.default.getUserByEmail(data.Email);
        /*console.log("=======================");
  
        console.log(user);
        console.log("=======================");
  */
        if (!user || !user.is_active) {
            user = yield userModel_1.default.AddUser({
                Username: data.Username,
                Email: data.Email,
                role: data.role || "userClient",
                Image: data.image,
            });
            yield userModel_1.default.updateUser(Number(user.id), { verified: true });
        }
        // Generate the token
        const tokenSecret = env_1.ENV.JWT_SECRET; // Replace with your actual secret key
        const tokenExpiry = env_1.ENV.JWT_EXPIRATION; // Replace with your desired token expiry time
        //console.log( "number is :",Number(user.id))
        const token = yield (0, token_1.generateAuthToken)(Number(user.id), user.email, tokenSecret || "", tokenExpiry || "");
        yield userModel_1.default.setLastLogin(Number(user === null || user === void 0 ? void 0 : user.id));
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
        yield (0, email_1.sendEMail)("Your application Login Verification Code", message, user.email);
        yield userVerification_1.default.addVerification(+user.id.toString(), otp.toString());
        return {
            Email: user === null || user === void 0 ? void 0 : user.email,
            Name: user === null || user === void 0 ? void 0 : user.username,
            userId: Number(user === null || user === void 0 ? void 0 : user.id),
            role: user === null || user === void 0 ? void 0 : user.role,
            token,
            twoFactorEnabled: user.is_two_factor,
            tokenExpiry,
        };
    }
    catch (error) {
        throw error;
    }
});
authService.getSession = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield userModel_1.default.getUserByEmail(data.email);
    return {
        email: user === null || user === void 0 ? void 0 : user.email,
        name: user === null || user === void 0 ? void 0 : user.username,
        id: user === null || user === void 0 ? void 0 : user.id,
        verified: user === null || user === void 0 ? void 0 : user.verified,
    };
});
authService.sendVerificationEmail = (Email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.getUserByEmail(Email);
    if (!user) {
        throw new Error("user doesn't exist ");
    }
    const token = (0, token_1.generateEmailToken)(Email, Number(user.id), emailTokenSecret || "", emailTokenExpiry || "");
    const message = (0, notifService_1.SendVerificationEmail)({
        email: Email,
        name: user.username,
        token: token,
    });
    return {
        token: token,
        message: message,
    };
});
authService.sendPasswordResetEmail = (Email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.getUserByEmail(Email);
    if (!user) {
        throw new Error("Email does not exist");
    }
    const token = (0, token_1.generateEmailToken)(Email, Number(user.id), emailTokenSecret || "", emailTokenExpiry || "");
    const message = (0, notifService_1.sendPasswordResetEmail)({
        email: Email,
        name: user.username,
        token: token,
    });
    return {
        token: token,
        message: message,
    };
});
authService.resendVerificationEmail = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UAMService_1.default.getUserById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    return _a.sendVerificationEmail(user.email);
});
authService.verifyEmail = (data, isEmailProvided) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (isEmailProvided) {
            const user = yield userModel_1.default.getUserByEmail(data.email);
            if (!user) {
                throw new Error("Unknown email");
            }
            return true;
        }
        else {
            const decodedToken = (0, token_1.decodeEmailToken)(data, emailTokenSecret || "");
            if (!decodedToken || typeof decodedToken === "string") {
                throw new Error("Invalid token");
            }
            const user = yield UAMService_1.default.getUserById(decodedToken.id);
            if (!user) {
                throw new Error("Unknown error");
            }
            if (user.email === decodedToken.email) {
                yield userModel_1.default.updateUser(decodedToken.id, { verified: true });
                return true;
            }
            return false;
        }
    }
    catch (error) {
        return {
            message: error.message,
        };
    }
});
authService.resetUserPassword = (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = (yield (0, token_1.hashPassword)(data.pass)).toString();
        yield userModel_1.default.updateUser(userId, {
            PasswordHash: hashedPassword,
        });
        return true;
    }
    catch (error) {
        return {
            message: error.message,
        };
    }
});
exports.default = authService;
