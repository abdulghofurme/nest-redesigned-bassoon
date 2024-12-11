import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { RegisterUserRequest, UserResponse } from 'src/model/user.model';
import { ValidationService } from 'src/common/validation/validation.service';
import { PrismaService } from 'src/common/prisma/prisma.service';

import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.info(`Register new user ${JSON.stringify(request)}`);
    const registerRequest =
      this.validationService.validate<RegisterUserRequest>(
        UserValidation.REGISTER,
        request,
      );

    const userWithSameUsernameCount = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (userWithSameUsernameCount > 0) {
      throw new HttpException('Username aleady exists', HttpStatus.BAD_REQUEST);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return {
      username: user.username,
      name: user.name,
    };
  }
}
