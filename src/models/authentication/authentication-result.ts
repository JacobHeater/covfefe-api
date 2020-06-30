import { User } from '@common/models/entities/user/user';

export interface AuthenticationResult {
  token: string;
  user: User;
}
