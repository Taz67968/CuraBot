import { JwtService } from '@nestjs/jwt';
export interface AuthUser {
    id: string;
    username: string;
    role: string;
}
export declare class AuthService {
    private jwtService;
    private readonly adminUsers;
    constructor(jwtService: JwtService);
    validateUser(username: string, password: string): Promise<AuthUser | null>;
    login(user: AuthUser): Promise<{
        access_token: string;
        user: AuthUser;
    }>;
    hashPassword(password: string): Promise<string>;
}
