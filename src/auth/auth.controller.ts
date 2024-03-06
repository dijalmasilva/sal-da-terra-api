import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import UserSignIn from '@/auth/dto/user-sign-in';
import { AuthService } from '@/auth/auth.service';
import { AuthGuard } from '@/auth/auth.guard';
import { Roles } from '@/auth/decorators/role.decorator';
import { Public } from '@/auth/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('sign-in')
  async signIn(@Body() signIn: UserSignIn) {
    return this.authService.signIn(signIn);
  }

  @Public()
  @Post('code')
  async code(@Body() body: { email: string; code: string }) {
    return this.authService.verifyCode(body.email, body.code);
  }

  @Get('sign-out')
  async signOut(@Request() req: any) {
    await this.authService.singOut(req.user.email);
    req.user = null;
  }

  @UseGuards(AuthGuard)
  @Roles(['VISITANTE'])
  @Get('me')
  getProfile(@Request() req: any) {
    this.authService.updateLastSignIn(req.user.email);
    return req.user;
  }
}
