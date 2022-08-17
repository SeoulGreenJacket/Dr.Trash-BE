export type JwtTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export type JwtPayload = {
  uuid: string;
  sub: number;
};
