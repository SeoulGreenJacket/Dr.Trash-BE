export class CreateUserDto {
  point: number;
  name: string;
  thumnail: string;
}

export class CreateOauthDto {
  user_id: string;
  provider: string;
  id: string;
}

export class UserPayload {
  name: string;
  thumnail: string;
}

export class OauthPayload {
  provider: string;
  id: string;
}
