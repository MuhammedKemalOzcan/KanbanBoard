import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './cards.entity';
import { BoardsModule } from 'src/boards/boards.module';
import { Board } from 'src/boards/boards.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, Board]), BoardsModule],
  providers: [CardsService],
  controllers: [CardsController],
})
export class CardsModule {}
