import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}
  async sendResetPasswordEmail(user: any, token: string) {
    await this.mailerService.sendMail({
      to: user.email,
      from: '"Support Team" <support@sabrsa.com>', // replace with your email
      subject: 'Reset Your Password',
      template: './reset-password', // path to the template file
      context: {
        name: user.displayName,
        token,
        // You can also include a URL if you prefer a link instead of a token
        resetUrl: `https://admin.sabrsa.com/reset-password?token=${token}`,
      },
    });
  }
  async sendVerificationEmail(user: any, token: string) {
    const result = await this.mailerService.sendMail({
      to: user.email,
      from: '"Support Team" <support@sabrsa.com>', // override default from
      subject: 'Welcome to Wellness App! Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.displayName,
        token,
      },
    });
    console.log(result);
  }
}
