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
import { User } from 'src/user/model/user.entity';

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

    // return user;
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    // const bookmark = await this.repo
    //   .createQueryBuilder('bookmark')
    //   .leftJoinAndSelect('bookmark.user', 'user')
    //   // .leftJoin('bookmark.user', 'user')
    //   .where('bookmark.id = :bookmarkId', { bookmarkId })
    //   .andWhere('bookmark.user = :userId', { userId })
    //   // .select('bookmark.id, user.email')
    //   // .getRawOne();
    //   .getOne();

    const bookmark = await this.repo.findOne({
      relations: {
        user: true,
      },
      where: {
        id: bookmarkId,
        // user: {
        //   id: userId,
        // },
      },
      // select: {
      //   user: {
      //     id: true,
      //     hash: false,
      //   },
      // },
    });

    console.log(userId, bookmark);

    if (!bookmark)
      throw new NotFoundException(
        `no bookmark with id:(${bookmarkId}) linked to this user id:(${userId})`,
      );

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
    //   const bookmark = await this.getBookmarkById(userId, bookmarkId);
    //   Object.assign(bookmark, dto);
    //   return this.repo.save(bookmark);
    // }
    // async removeBookmark(userId: number, bookmarkId: number) {
    //   const bookmark = await this.getBookmarkById(userId, bookmarkId);
    //   return this.repo.remove(bookmark);
  }
}
