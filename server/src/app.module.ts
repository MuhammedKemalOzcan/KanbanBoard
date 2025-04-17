import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsModule } from './boards/boards.module';
import { Card } from './cards/cards.entity';
import { Board } from './boards/boards.entity';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST || 'mysql', // Docker container adıyla bağlanıyor
      port: 3306,
      username: process.env.DATABASE_USERNAME || 'kemal',
      password: process.env.DATABASE_PASSWORD || 'kemal123',
      database: process.env.DATABASE_NAME || 'kanban_db',
      entities: [Board, Card],
      synchronize: true, // Prod ortamda false olmalı
    }),
    BoardsModule,
    CardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
