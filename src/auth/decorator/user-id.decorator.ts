import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const UserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    if (context.getType() === 'http') {
      const user = context.switchToHttp().getRequest().user;
      if (user) {
        return user.id;
      } else {
        throw new UnauthorizedException();
      }
    }
    throw new Error('User decorator only works with http requests');
  },
);
