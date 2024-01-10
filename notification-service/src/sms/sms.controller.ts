import { Controller } from '@nestjs/common';
import { SmsService } from './sms.service';
import { GrpcMethod } from '@nestjs/microservices';
import { sms } from 'src/proto/sms';
import { Observable, of } from 'rxjs';
//import { SmsService } from './sms.service';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @GrpcMethod('SmsService', 'InitPhoneNumberVerification')
  async initPhoneNumberVerification(
    request: sms.PhoneNumberRequest,
  ): Promise<sms.VerificationResponse> {
    return this.smsService.initPhoneNumberVerification(request);
  }

  @GrpcMethod('SmsService', 'VerifyPhoneNumber')
  async verifyPhoneNumber({
    phoneNumber,
    otp,
  }: sms.PhoneNumberVerificationRequest): Promise<sms.VerifyResponse> {
    return this.smsService.verifyPhoneNumber({ phoneNumber, otp });
  }
}
