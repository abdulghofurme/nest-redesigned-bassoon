import { createParamDecorator, ExecutionContext, HttpException, HttpStatus, SetMetadata } from '@nestjs/common';

// export const Auth = (...args: string[]) => SetMetadata('auth', args);
export const Auth = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest()
        const user = request.user
        if (user) {
            return user;
        } else {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
        }
    }
)