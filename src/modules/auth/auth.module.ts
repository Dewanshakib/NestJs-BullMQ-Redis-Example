import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { BullModule } from '@nestjs/bullmq';
import { AuthService } from './auth.service';
import { EmailSentWorker } from 'src/tasks/email-background-worker';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'email-verification' })],
  controllers: [AuthController],
  providers: [AuthService,EmailSentWorker,MailService],
})
export class AuthModule {}
