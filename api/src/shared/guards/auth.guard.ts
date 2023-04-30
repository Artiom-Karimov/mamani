import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AsyncJwt } from '../tools/async-jwt';
import { ViewUserDto } from '../../features/users/dto/view-user.dto';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserQuery } from '../../features/users/usecases/queries/get-user.query';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly key: string;

  constructor(private readonly queryBus: QueryBus, config: ConfigService) {
    const key = config.get('JWT_SECRET_KEY');
    if (!key) throw new Error('You should put JWT_SECRET_KEY into environment');
    this.key = key;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();

    try {
      const payload = await AsyncJwt.verify(token, this.key);
      const user = await this.queryBus.execute(
        new GetUserQuery(payload.userId),
      );
      if (!user) throw new Error();
      request.user = new ViewUserDto(user);
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
