import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './model/user.entity';
import { AuthService } from './../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,

    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  // async signup(email: string, password: string) {
  //   const [user] = await this.findByEmail(email);

  //   if (user)
  //     throw new BadRequestException('email already have been used before');

  //   const encryptedHash = await this.authService.hashPassword(password);
  //   const { hash, ...payload } = await this.create(email, encryptedHash);

  //   return await this.authService.generateJwt(payload);
  // }

  // async login(email: string, password: string) {
  //   const [user] = await this.findByEmail(email);
  //   if (!user) throw new NotFoundException('email not found');

  //   const check = await this.authService.comparePasswords(password, user.hash);

  //   if (!check) throw new BadRequestException('Wrong Credentials');

  //   const { hash, ...payload } = user;

  //   const accessToken = await this.authService.generateJwt(payload);

  //   return { accessToken };
  // }

  async create(email: string, hash: string) {
    const user = await this.repo.create({ email, hash });
    return this.repo.save(user);
  }

  async findOne(id: number) {
    const user = await this.repo.findOneBy({ id });

    if (!user) throw new NotFoundException('user not found');

    return user;
  }

  findByEmail(email: string) {
    return this.repo.findBy({ email });
  }

  findAll() {
    return this.repo.find();
  }

  async update(id: number, data: Partial<User>) {
    const user = await this.findOne(id);
    Object.assign(user, data);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.repo.remove(user);
  }
}
