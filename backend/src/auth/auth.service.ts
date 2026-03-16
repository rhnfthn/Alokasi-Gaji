import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes, createHash } from 'crypto';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './types/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private signToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async register(data: { name: string; email: string; password: string }) {
    const user = await this.usersService.createUser(data);
    const accessToken = this.signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, accessToken };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.usersService.findForAuthByEmail(data.email);
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const ok = await bcrypt.compare(data.password, user.password);
    if (!ok) {
      throw new BadRequestException('Invalid email or password');
    }

    const accessToken = this.signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: await this.usersService.findPublicById(user.id),
      accessToken,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findForAuthByEmail(email);
    if (!user) {
      // Do not leak whether the email exists.
      return { success: true };
    }

    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await this.usersService.setResetPasswordToken({
      email,
      tokenHash,
      expiresAt,
    });

    // In production, you would email the token as a link.
    return { success: true, token };
  }

  async resetPassword(data: { token: string; password: string }) {
    const tokenHash = createHash('sha256').update(data.token).digest('hex');
    return this.usersService.resetPasswordWithToken({
      tokenHash,
      newPassword: data.password,
    });
  }
}
