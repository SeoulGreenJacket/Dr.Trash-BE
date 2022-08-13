export class CreateUserDto {
  point: number;
  name: string;
  image_uri: string;
}

export class CreateOAuthDto {
  user_id: number;
  provider: string;
  oauth_id: string;
}

export class UserPayload {
  name: string;
  image_uri: string;
}

export class OAuthPayload {
  provider: string;
  oauth_id: string;
}

// db test용
// export class id {
//   user_id: number;
// }
