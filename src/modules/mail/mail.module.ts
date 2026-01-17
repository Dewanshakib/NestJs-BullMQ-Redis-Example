import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config';
import {} from "nodemailer"

@Module({
  imports: [
    // Nodemailder config
    ConfigModule.forRoot(),
  ],
  providers: [MailService],
})
export class MailModule {}
