import { BadRequestException, Injectable } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { sms } from 'src/proto/sms';
import { Twilio } from 'twilio';

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
    const verificationInstance = await this.twilioClient.verify
      .services(service_sid)
      .verifications.create({
        to: request.phoneNumber,
        channel: 'sms',
      });

    // Map the properties of verificationInstance to a new object
    const response: sms.VerificationResponse = {
      status: verificationInstance.status,
    };
    return response;
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
