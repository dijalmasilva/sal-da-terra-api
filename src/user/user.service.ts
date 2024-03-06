import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UserCompleteDto } from '@/user/dto/user-complete.dto';
import { JwtTokenService } from '@/jwt-token/jwt-token.service';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private jwtTokenService: JwtTokenService,
  ) {}

  private async getRolesOfUser(id: number): Promise<string[]> {
    const userRoles = await this.prismaService.userRoles.findMany({
      where: {
        user_id: id,
      },
      select: {
        role: true,
      },
    });

    return userRoles.map((userRole) => userRole.role.name);
  }

  async completeProfile(id: number, userComplete: UserCompleteDto) {
    const user = await this.prismaService.user.update({
      where: { id },
      data: {
        name: userComplete.name.trim(),
        phone: userComplete.phone.trim(),
        birthdate: userComplete.birthdate,
      },
      include: {
        roles: true,
      },
    });

    const roles = await this.getRolesOfUser(id);

    const userResult = {
      ...user,
      roles,
    };

    return {
      token: this.jwtTokenService.sign(userResult),
      user: userResult,
    };
  }
}
