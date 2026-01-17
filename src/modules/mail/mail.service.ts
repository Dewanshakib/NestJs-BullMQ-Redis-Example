import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

  emailTransport() {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });

    return transporter;
  }

  async sendEmail(to: string, username: string, otp: string) {
    const transport = this.emailTransport();

    const appName = this.configService.get<string>('APP_NAME') || 'BullMQ';
    const supportEmail =
      this.configService.get<string>('SUPPORT_EMAIL') || 'support@gmail.com';

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify Your ${appName} Account</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 10px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px;background:white;border-radius:20px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);padding:44px 32px;text-align:center;">
              <h1 style="margin:0;color:white;font-size:32px;font-weight:800;letter-spacing:-1px;">
                ${appName}
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:44px 40px 32px;text-align:center;">
              <h2 style="margin:0 0 20px;font-size:24px;font-weight:700;color:#111827;">
                Hey ${username}! 👋
              </h2>

              <p style="margin:0 0 28px;color:#374151;font-size:16px;line-height:1.6;">
                Welcome to ${appName}!<br>
                Use this code to verify your email and start exploring:
              </p>

              <!-- OTP - big, bold, beautiful -->
              <div style="margin:32px auto;background:#f8f9fc;border-radius:16px;padding:28px 40px;border:1px solid #e5e7eb;display:inline-block;font-size:48px;font-weight:700;letter-spacing:14px;color:#4f46e5;font-family:monospace;">
                ${otp}
              </div>

              <p style="margin:24px 0 32px;color:#6b7280;font-size:15px;">
                This code expires in <strong>10 minutes</strong>.
              </p>

              <p style="margin:0;color:#9ca3af;font-size:14px;line-height:1.6;">
                Didn't sign up? Just ignore this email.<br>
                <strong>Never share this code with anyone.</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f1f5f9;padding:32px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#6b7280;font-size:13px;">
                © ${new Date().getFullYear()} ${appName}. All rights reserved.<br>
                <a href="${this.configService.get<string>('FRONTEND_URL') || 'https://yourapp.com'}" 
                   style="color:#4f46e5;text-decoration:none;">
                  ${this.configService.get<string>('FRONTEND_URL')?.replace('https://', '') || 'yourapp.com'}
                </a>
                • <a href="mailto:${supportEmail}" style="color:#4f46e5;text-decoration:none;">Support</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

    const options: nodemailer.SendMailOptions = {
      from:
        this.configService.get<string>('EMAIL_FROM') ||
        this.configService.get<string>('EMAIL_USER'),
      to,
      subject: `Your ${appName} Verification Code`,
      html,
      // Optional: nice plain text fallback
      text: `Hey ${username}!\n\nYour verification code: ${otp}\n\nIt expires in 10 minutes.\n\nDidn't sign up? Just ignore this email.\n\n${appName} Team`,
    };

    try {
      await transport.sendMail(options);
      console.log(`Verification email sent to ${to}`);
      return true;
    } catch (error) {
      console.error('Failed to send verification email:', error);
      return false;
    }
  }
}
