import { Body, Controller, Post } from '@nestjs/common';
import { EmailVerificationDto } from './dto/email-verification-dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post('email-verification')
  async handleEmailVerification(
    @Body() emailVerificationDto: EmailVerificationDto,
  ) {
    return this.AuthService.handleEmailVerification(emailVerificationDto);
  }
}
