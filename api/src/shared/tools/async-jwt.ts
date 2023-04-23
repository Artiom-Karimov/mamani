import { Secret, sign, verify } from 'jsonwebtoken';
import { TokenPayload } from '../../auth/dto/token-payload';

export class AsyncJwt {
  static async sign(payload: TokenPayload, key: Secret): Promise<string> {
    const pojo = JSON.parse(JSON.stringify(payload));
    return new Promise((resolve, reject) => {
      sign(pojo, key, (error, encoded) => {
        if (error) {
          return reject(error);
        }
        resolve(encoded);
      });
    });
  }

  static async verify(token: string, key: string): Promise<TokenPayload> {
    return new Promise((resolve, reject) => {
      verify(token, key, (error, decoded) => {
        if (error) {
          return reject(error);
        }
        resolve(decoded as TokenPayload);
      });
    });
  }
}
