import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersRepository } from '../../users/database/users.repository';
import { ConfigService } from '@nestjs/config';
import { AsyncJwt } from '../tools/async-jwt';
import { ViewUserDto } from '../../users/dto/view-user.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly key: string;

  constructor(
    private readonly repository: UsersRepository,
    config: ConfigService,
  ) {
    this.key = config.get('JWT_SECRET_KEY');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();

    try {
      const payload = await AsyncJwt.verify(token, this.key);
      const user = await this.repository.get(payload.userId);
      request['user'] = new ViewUserDto(user);
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
