import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../commands/login.command';
import { SessionDto } from '../../dto/session.dto';
import { UsersRepository } from '../../../users/database/users.repository';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { TokenPayload } from '../../dto/token-payload';
import { AsyncJwt } from '../../../shared/tools/async-jwt';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  private readonly key: string;

  constructor(
    private readonly repository: UsersRepository,
    config: ConfigService,
  ) {
    const key = config.get('JWT_SECRET_KEY');
    if (!key) throw new Error('You should put JWT_SECRET_KEY into environment');
    this.key = key;
  }

  async execute(command: LoginCommand): Promise<SessionDto> {
    const { email, password } = command.data;

    const user = await this.repository.getByEmail(email);
    if (!user) throw new UnauthorizedException('Wrong credentials');

    const success = await user.checkPassword(password);
    if (!success) throw new UnauthorizedException('Wrong credentials');

    const payload = new TokenPayload(user.id);
    const token = await AsyncJwt.sign(payload, this.key);

    return { token };
  }
}
