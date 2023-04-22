export class TokenPayload {
  date: number;
  userId: string;

  constructor(userId: string) {
    this.userId = userId;
    this.date = Date.now();
  }
}
