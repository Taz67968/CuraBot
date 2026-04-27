import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

export interface AuthUser {
  id: string;
  username: string;
  role: string;
}

@Injectable()
export class AuthService {
  // In a real app, this would be a database of admin users
  private readonly adminUsers = [
    {
      id: '1',
      username: 'admin',
      password: '$2a$10$example.hash.here', // bcrypt hash of 'password'
      role: 'admin',
    },
  ];

  constructor(private jwtService: JwtService) {}

  /**
   * Validate admin credentials
   */
  async validateUser(username: string, password: string): Promise<AuthUser | null> {
    const user = this.adminUsers.find((u) => u.username === username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const result = { id: user.id, username: user.username, role: user.role };
      return result;
    }
    return null;
  }

  /**
   * Generate JWT token for authenticated user
   */
  async login(user: AuthUser) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  /**
   * Hash a password
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
