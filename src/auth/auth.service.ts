import {
  BadRequestException,
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
  ) {}

  //   async encryptPassword(plainPassword: string, salt = null) {
  //     salt = salt || randomBytes(8).toString('hex');
  //     const hash = ((await scrypt(plainPassword, salt, 32)) as Buffer).toString(
  //       'hex',
  //     );
  //     return salt + '.' + hash;
  //   }

  //   async signup(email: string, password: string) {
  //     const [user] = await this.userService.findOneByEmail(email);

  //     if (user)
  //       throw new BadRequestException('email already have been used before');

  //     const encryptedHash = await this.encryptPassword(password);

  //     return this.userService.create(email, encryptedHash);
  //   }

  //   async login(email: string, password: string) {
  //     const [user] = await this.userService.findOneByEmail(email);

  //     if (!user) throw new NotFoundException('email not exist');

  //     const [salt, storedHash] = user.hash.split('.');

  //     const encrypted = await this.encryptPassword(password, salt);
  //     const [_, hash] = encrypted.split('.');

  //     if (storedHash !== hash) throw new BadRequestException('bad credentials');

  //     return user;
  //   }

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
