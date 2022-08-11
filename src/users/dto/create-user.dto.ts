export class CreateUserDto {
  point: number;
  name: string;
  thumnail: string;
}

export class CreateOAuthDto {
  user_id: string;
  provider: string;
  id: string;
}

export class UserPayload {
  name: string;
  thumnail: string;
}

export class OAuthPayload {
  provider: string;
  id: string;
}
