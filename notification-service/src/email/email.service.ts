import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}
  async sendResetPasswordEmail(email, name, token: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: '"Support Team" <support@sabrsa.com>', // replace with your email
        subject: 'Reset Your Password',
        template: './reset-password', // path to the template file
        context: {
          name,
          token,
          // You can also include a URL if you prefer a link instead of a token
          resetUrl: `https://admin.sabrsa.com/reset-password?token=${token}`,
        },
      });
      return { status: true };
    } catch (error) {
      console.log(error);
      return { status: false };
    }
  }
  async sendVerificationEmail(email, name, token: string) {
    try {
      const result = await this.mailerService.sendMail({
        to: email,
        from: '"Support Team" <support@sabrsa.com>', // override default from
        subject: 'Welcome to Wellness App! Confirm your Email',
        template: './confirmation', // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
          name,
          token,
        },
      });
      return { status: true };
    } catch (error) {
      console.log(error);
      return { status: false };
    }
  }
}
