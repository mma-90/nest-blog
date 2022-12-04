import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Get,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dtos/create-bookmark.dto';
import { JwtAuthGuard } from './../auth/guard/jwt.guard';
import { UpdateBookmarkDto } from './dtos/update-bookmark.dto';

@UseGuards(JwtAuthGuard)
@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post()
  createBookmark(
    @GetUser('id') userId: number,
    @Body() dto: CreateBookmarkDto,
  ) {
    return this.bookmarkService.createBookmark(userId, dto);
  }

  @Get('')
  getBookmarks(@GetUser('id') userId: number) {
    return this.bookmarkService.getBookmarks(userId);
  }

  @Get(':id')
  getBookmarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return this.bookmarkService.getBookmarkById(userId, bookmarkId);
  }

  @Patch(':id')
  updateBookmark(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: UpdateBookmarkDto,
  ) {
    return this.bookmarkService.updateBookmark(userId, bookmarkId, dto);
  }

  @Delete(':id')
  removeBookmark(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    // return this.bookmarkService.removeBookmark(userId, bookmarkId);
  }
}
