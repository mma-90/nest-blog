import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Body,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './model/user.entity';
import { UserInterface } from './model/user.interface';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(email: string, hash: string) {
    const user = await this.repo.create({ email, hash });
    return this.repo.save(user);
  }

  async findOne(id: number) {
    const user = await this.repo.findOneBy({ id });

    if (!user) throw new NotFoundException('user not found');

    return user;
  }

  findOneByEmail(email: string) {
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
