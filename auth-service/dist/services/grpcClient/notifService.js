"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPhoneNumber = exports.initNumberVerification = exports.sendPasswordResetEmail = exports.SendVerificationEmail = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
// Load the generated proto file
const packageDefinition = protoLoader.loadSync('src/services/grpcClient/email-sms.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
// Extract the service definition from the loaded package
const notfiService = grpc.loadPackageDefinition(packageDefinition);
const EmailService = notfiService.sms.EmailService;
const smsService = notfiService.sms.SmsService;
// Create a client for the gRPC service
const emailClient = new EmailService('localhost:5000', grpc.credentials.createInsecure());
const smsClient = new smsService('localhost:5000', grpc.credentials.createInsecure());
const SendVerificationEmail = (request) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        emailClient.SendVerificationEmail(request, (error, response) => {
            if (error) {
                console.error('Error:', error);
                reject(error);
            }
            else {
                console.log('Response:', response);
                resolve(response);
            }
        });
    });
});
exports.SendVerificationEmail = SendVerificationEmail;
const sendPasswordResetEmail = (request) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        emailClient.SendPasswordResetEmail(request, (error, response) => {
            if (error) {
                console.error('Error:', error);
                reject(error);
            }
            else {
                console.log('Response:', response);
                resolve(response);
            }
        });
    });
});
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const initNumberVerification = (request) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        smsClient.InitNumberVerification(request, (error, response) => {
            if (error) {
                console.error('Error:', error);
                reject(error);
            }
            else {
                console.log('Response:', response);
                resolve(response);
            }
        });
    });
});
exports.initNumberVerification = initNumberVerification;
const verifyPhoneNumber = (request) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        smsClient.VerifyPhoneNumber(request, (error, response) => {
            if (error) {
                console.error('Error:', error);
                reject(error);
            }
            else {
                console.log('Response:', response);
                resolve(response);
            }
        });
    });
});
exports.verifyPhoneNumber = verifyPhoneNumber;
/*// Replace 'email', 'name', 'token' with actual values
const request = { email: 'ja_bousnane@esi.dz', name: 'Johns Doe', token: 'xyzd123' };

// Make a gRPC request
client.SendVerificationEmail(request, (error: any, response: any) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Response:', response);
  }
});*/ 
