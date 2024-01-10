import { Controller } from '@nestjs/common';
import { EmailService } from './email.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @GrpcMethod('EmailService', 'SendResetPasswordEmail')
  async sendResetPasswordEmail({
    email,
    name,
    token,
  }: {
    email: string;
    name: string;
    token: string;
  }): Promise<any> {
    return await this.emailService.sendResetPasswordEmail(email, name, token);
  }
  @GrpcMethod('EmailService', 'SendVerificationEmail')
  async sendVerificationEmail({
    email,
    name,
    token,
  }: {
    email: string;
    name: string;
    token: string;
  }): Promise<any> {
    console.log('email', email);

    return await this.emailService.sendVerificationEmail(email, name, token);
  }
}
