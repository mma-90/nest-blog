import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { Bookmark } from './bookmark.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark]), UserModule],
  providers: [BookmarkService],
  controllers: [BookmarkController],
})
export class BookmarkModule {}
