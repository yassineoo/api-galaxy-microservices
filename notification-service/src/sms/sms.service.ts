import { BadRequestException, Injectable } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { sms } from 'src/proto/sms';
import { Twilio } from 'twilio';
import { Observable, of } from 'rxjs';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
@Injectable()
export class SmsService {
  private twilioClient: Twilio;
  constructor() {
    const account_sid = process.env.TWILIO_ACCOUNT_SID;
    const auth_token = process.env.TWILIO_AUTH_TOKEN;
    this.twilioClient = new Twilio(account_sid, auth_token);
  }
  @GrpcMethod('SmsService', 'InitPhoneNumberVerification')
  async initPhoneNumberVerification(
    request: sms.PhoneNumberRequest,
  ): Promise<sms.VerificationResponse> {
    const service_sid = process.env.TWILIO_VERIFICATION_SERVICE_SID;
    let isVerified = false;

    try {
      const callerIds = await this.twilioClient.outgoingCallerIds.list();

      callerIds.forEach((callerId) => {
        if (callerId.phoneNumber === request.phoneNumber) {
          isVerified = true;
        }
      });

      if (!isVerified) {
        throw new Error(
          'The phone number is unverified. Trial accounts cannot send messages to unverified numbers.',
        );
      }

      const verificationInstance = await this.twilioClient.verify.v2
        .services(service_sid)
        .verifications.create({
          to: request.phoneNumber,
          channel: 'sms',
        });

      return {
        status: verificationInstance.status,
      };
    } catch (error) {
      console.error(error.message);
      // Handle the error appropriately here, such as sending it back to the client
      throw error;
    }
  }

  @GrpcMethod('SmsService', 'VerifyPhoneNumber')
  async verifyPhoneNumber({
    phoneNumber,
    otp,
  }: sms.PhoneNumberVerificationRequest): Promise<sms.VerifyResponse> {
    const service_sid = process.env.TWILIO_VERIFICATION_SERVICE_SID;
    try {
      const result = await this.twilioClient.verify
        .services(service_sid)
        .verificationChecks.create({ to: phoneNumber, code: otp });

      if (!result.valid || result.status !== 'approved') {
        return { status: false };
      }
      return { status: true };
    } catch (e) {
      return { status: false };
    }
  }
}
