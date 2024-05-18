import { BaseDTO, UserRole } from '@mamani/shared';

export type UserDTO = BaseDTO & {
  readonly role: UserRole;

  readonly firstName: string;

  readonly lastName: string;

  readonly email: string;

  readonly hash: string;
};
