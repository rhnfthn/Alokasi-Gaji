// Augment Express Request type to include Passport's `user` property.
// This keeps NestJS controllers/guards type-safe under isolatedModules.
import type { RequestUser } from '../common/types/request-user.type';

declare global {
  namespace Express {
    type User = RequestUser;

    interface Request {
      user?: User;
    }
  }
}

export {};
