import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookmarkDto } from './dtos/create-bookmark.dto';
import { Bookmark } from './bookmark.entity';
import { Repository } from 'typeorm';
import { UpdateBookmarkDto } from './dtos/update-bookmark.dto';
import { UserService } from './../user/user.service';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark) private repo: Repository<Bookmark>,
    private userService: UserService,
  ) {}

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    const user = await this.userService.findOne(userId);
    const bookmark = this.repo.create(dto);
    bookmark.user = user;

    return this.repo.save(bookmark);
  }

  async getBookmarks(userId: number) {
    const user = await this.userService.findOneWith(userId, 'bookmarks');
    return {
      user: { id: user.id },
      bookmarks: [...user.bookmarks],
    };
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.repo.findOne({
      where: { id: bookmarkId },
      relations: ['user'],
    });
    // const bookmark = this.repo
    //   .createQueryBuilder('bookmark')
    //   // .leftJoinAndSelect('bookmark.user', 'users.id')
    //   .leftJoin('bookmark.user', 'users.id')
    //   .select('desc')
    //   .getOne();

    if (!bookmark) throw new NotFoundException('bookmark not found');

    if (!bookmark.user || bookmark.user.id !== userId)
      throw new UnauthorizedException(
        'You are not allowed to access this resource',
      );
    return bookmark;
  }

  async updateBookmark(
    userId: number,
    bookmarkId: number,
    dto: UpdateBookmarkDto,
  ) {
    // if (!dto) throw new BadRequestException('update are missing in request');

    const bookmark = await this.getBookmarkById(userId, bookmarkId);

    Object.assign(bookmark, dto);

    return this.repo.save(bookmark);
  }

  async removeBookmark(userId: number, bookmarkId: number) {
    const bookmark = await this.getBookmarkById(userId, bookmarkId);

    return this.repo.remove(bookmark);
  }
}
