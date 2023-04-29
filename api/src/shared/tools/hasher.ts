import * as bcrypt from 'bcrypt';

export class Hasher {
  private static readonly rounds = 10;

  public static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, Hasher.rounds);
  }
  public static async compare(
    hash: string,
    password: string | undefined,
  ): Promise<boolean> {
    if (!password || !hash) return false;
    return bcrypt.compare(password, hash);
  }
}
