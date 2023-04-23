export class TokenPayload {
  userId: string;
  iat: number;

  constructor(userId: string) {
    this.userId = userId;
    this.iat = Math.floor(Date.now() / 1000);
  }
}
