export class CreateUserDto {
  point: number;
  name: string;
  image_uri: string;
}

export class CreateOAuthDto {
  user_id: string;
  provider: string;
  id: string;
}

export class UserPayload {
  name: string;
  image_uri: string;
}

export class OAuthPayload {
  provider: string;
  id: string;
}
