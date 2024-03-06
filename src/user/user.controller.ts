import {
  Body,
  Controller,
  NotFoundException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@/auth/auth.guard';
import { UserCompleteDto } from './dto/user-complete.dto';
import { UserService } from '@/user/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Post('profile/complete')
  async completeProfile(
    @Request() req: any,
    @Body() userComplete: UserCompleteDto,
  ) {
    const user = req.user;
    if (user) {
      const result = await this.userService.completeProfile(
        user.id,
        userComplete,
      );
      req.user = result.user;
      return result;
    } else {
      throw new NotFoundException('User not found');
    }
  }
}
