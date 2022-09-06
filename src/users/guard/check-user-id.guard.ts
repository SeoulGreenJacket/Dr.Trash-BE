import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class CheckUserIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const params = request.params;

    return user.id === parseInt(params.id);
  }
}
