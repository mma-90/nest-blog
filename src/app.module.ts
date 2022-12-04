import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/model/user.entity';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/guard/roles.guard';
import { BookmarkModule } from './bookmark/bookmark.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT') || 5432,
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASS'),
        database: configService.get('DATABASE_NAME'),
        entities: [User],
        // entities: ['**/*.entity.{ts,js}'],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    BookmarkModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule {}
