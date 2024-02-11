import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

// Load the generated proto file
const packageDefinition = protoLoader.loadSync('src/services/grpcClient/email-sms.proto', {
  keepCase: true,
  longs: String,  
  enums: String,
  defaults: true,
  oneofs: true,
});

// Extract the service definition from the loaded package
const notfiService: any = grpc.loadPackageDefinition(packageDefinition);
const EmailService = notfiService.sms.EmailService;
const smsService = notfiService.sms.SmsService;

// Create a client for the gRPC service
const emailClient = new EmailService('localhost:5000', grpc.credentials.createInsecure());
const smsClient = new smsService('localhost:5000', grpc.credentials.createInsecure());

export const SendVerificationEmail = async (request: { email: string, name: string, token: string }) => {
  return new Promise((resolve, reject) => {
    emailClient.SendVerificationEmail(request, (error: any, response: any) => {
      if (error) {
        console.error('Error:', error);
        reject(error);
      } else {
        console.log('Response:', response);
        resolve(response);
      }
    });
  });
};

export const sendPasswordResetEmail = async (request: { email: string, name: string, token: string }) => {
  return new Promise((resolve, reject) => {
    emailClient.SendPasswordResetEmail(request, (error: any, response: any) => {
      if (error) {
        console.error('Error:', error);
        reject(error);
      } else {
        console.log('Response:', response);
        resolve(response);
      }
    });
  });
};

export const initNumberVerification = async (request: { phoneNumber: string }) => {
  return new Promise((resolve, reject) => {
    smsClient.InitNumberVerification(request, (error: any, response: any) => {
      if (error) {
        console.error('Error:', error);
        reject(error);
      } else {
        console.log('Response:', response);
        resolve(response);
      }
    });
  });
};

export const verifyPhoneNumber = async (request: { phoneNumber: string, otp: string }) => {
  return new Promise((resolve, reject) => {
    smsClient.VerifyPhoneNumber(request, (error: any, response: any) => {
      if (error) {
        console.error('Error:', error);
        reject(error);
      } else {
        console.log('Response:', response);
        resolve(response);
      }
    });
  });
};

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