import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // Nodemailder config
    ConfigModule,
  ],
  providers: [MailService],
})
export class MailModule {}
