import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './boards.entity';
import { Card } from 'src/cards/cards.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, Card])],
  providers: [BoardsService],
  controllers: [BoardsController],
})
export class BoardsModule {}
