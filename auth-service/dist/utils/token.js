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
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeEmailToken = exports.decodeAuthToken = exports.generateEmailToken = exports.generateAuthToken = exports.checkPassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const random_bytes_1 = __importDefault(require("random-bytes"));
//this is the function that will hash the password
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, 10);
});
exports.hashPassword = hashPassword;
//this is the function that will check the password
const checkPassword = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(password, hashedPassword);
});
exports.checkPassword = checkPassword;
//this is the function that will generate the token
const generateAuthToken = (userId, email, tokenSecret, tokenExpiry) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = (yield (0, random_bytes_1.default)(32)).toString("hex");
    const tokenData = { userId, email, authToken };
    const signedToken = jsonwebtoken_1.default.sign(tokenData, tokenSecret, {
        expiresIn: tokenExpiry,
    });
    return { token: signedToken, expiry: tokenExpiry };
});
exports.generateAuthToken = generateAuthToken;
const generateEmailToken = (email, id, tokenSecret, tokenExpiry) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = (yield (0, random_bytes_1.default)(32)).toString("hex");
    const tokenData = { email, id, authToken };
    const signedToken = jsonwebtoken_1.default.sign(tokenData, tokenSecret, {
        expiresIn: tokenExpiry,
    });
    return signedToken;
});
exports.generateEmailToken = generateEmailToken;
//this is the function that will decode the token
const decodeAuthToken = (token, tokenSecret) => {
    try {
        // Attempt to verify and decode the token
        const decoded = jsonwebtoken_1.default.verify(token, tokenSecret);
        return decoded;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new Error("Token has expired");
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new Error("Invalid token");
        }
        else {
            throw new Error("Token verification failed");
        }
    }
};
exports.decodeAuthToken = decodeAuthToken;
const decodeEmailToken = (token, tokenSecret) => {
    try {
        // Attempt to verify and decode the token
        const decoded = jsonwebtoken_1.default.verify(token, tokenSecret);
        return decoded;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return "Token has expired";
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return "Invalid token";
        }
        else {
            return "Token verification failed";
        }
    }
};
exports.decodeEmailToken = decodeEmailToken;
