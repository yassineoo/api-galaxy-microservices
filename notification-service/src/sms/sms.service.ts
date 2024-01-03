import { BadRequestException, Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
  private twilioClient: Twilio;
  constructor() {
    const account_sid = process.env.TWILIO_ACCOUNT_SID;
    const auth_token = process.env.TWILIO_AUTH_TOKEN;
    this.twilioClient = new Twilio(account_sid, auth_token);
  }
  async initPhoneNumberVerification(phoneNumber: string) {
    const service_sid = process.env.TWILIO_VERIFICATION_SERVICE_SID;
    return this.twilioClient.verify
      .services(service_sid)
      .verifications.create({ to: phoneNumber, channel: 'sms' });
  }
  async verifyPhoneNumber(phoneNumber: string, otp: string) {
    const service_sid = process.env.TWILIO_VERIFICATION_SERVICE_SID;
    try {
      const result = await this.twilioClient.verify
        .services(service_sid)
        .verificationChecks.create({ to: phoneNumber, code: otp });

      if (!result.valid || result.status !== 'approved') {
        throw new BadRequestException('Wrong code provided');
      }
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
