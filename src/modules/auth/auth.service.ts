import { Injectable } from '@nestjs/common';
import { EmailVerificationDto } from './dto/email-verification-dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AuthService {
  constructor(
    @InjectQueue('email-verification') private readonly queueCleint: Queue,
  ) {}

  async handleEmailVerification(emailVerificationDto: EmailVerificationDto) {
    await this.queueCleint.add('email.sent',emailVerificationDto);

    return { message: 'Email sent for verification. Please check your email' };
  }
}
