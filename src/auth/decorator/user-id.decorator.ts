import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    if (context.getType() === 'http') {
      const user = context.switchToHttp().getRequest().user;
      return user;
    } else {
      throw new Error('User decorator only works with http requests');
    }
  },
);
