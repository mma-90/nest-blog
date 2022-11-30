import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './../user/user.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/model/user.entity';
import * as bcrypt from 'bcrypt';
import { UserInterface } from './../user/model/user.interface';
import { ConfigService } from '@nestjs/config';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    // private userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async signup(email: string, password: string) {
    const [user] = await this.userService.findByEmail(email);

    if (user)
      throw new BadRequestException('email already have been used before');

    const encryptedHash = await this.hashPassword(password);
    const { hash, ...payload } = await this.userService.create(
      email,
      encryptedHash,
    );

    return await this.generateJwt(payload);
  }

  async login(email: string, password: string) {
    const [user] = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('email not found');

    const check = await this.comparePasswords(password, user.hash);

    if (!check) throw new BadRequestException('Wrong Credentials');

    const { hash, ...payload } = user;

    const accessToken = await this.generateJwt(payload);

    return { accessToken };
  }

  async generateJwt(payload: UserInterface): Promise<string> {
    const token = await this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRE_IN'),
    });

    return token;
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, +this.config.get('SALT_ROUND'));
  }

  async comparePasswords(
    plainPassword: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hash);
  }

  async verifyToken(token: string) {
    return await this.jwtService.verify(token);
  }
}
