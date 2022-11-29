import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './model/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserInterface } from './model/user.interface';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UserService } from './user.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async encryptPassword(plainPassword: string, salt = null) {
    salt = salt || randomBytes(8).toString('hex');
    const hash = ((await scrypt(plainPassword, salt, 32)) as Buffer).toString(
      'hex',
    );
    return salt + '.' + hash;
  }

  async signup(email: string, password: string) {
    const [user] = await this.userService.findOneByEmail(email);

    if (user)
      throw new BadRequestException('email already have been used before');

    const encryptedHash = await this.encryptPassword(password);

    return this.userService.create(email, encryptedHash);
  }

  async login(email: string, password: string) {
    const [user] = await this.userService.findOneByEmail(email);

    if (!user) throw new NotFoundException('email not exist');

    const [salt, storedHash] = user.hash.split('.');

    const encrypted = await this.encryptPassword(password, salt);
    const [_, hash] = encrypted.split('.');

    if (storedHash !== hash) throw new BadRequestException('bad credentials');

    return user;
  }

  signout() {
    return 'sign out';
  }
}
