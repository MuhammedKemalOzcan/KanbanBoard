import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './list.entity';
import { Card } from 'src/cards/cards.entity';
import { Board } from 'src/boards/boards.entity';
import { ListService } from './lists.service';
import { ListController } from './lists.controller';

@Module({
  imports: [TypeOrmModule.forFeature([List, Card, Board])],
  providers: [ListService],
  controllers: [ListController],
})
export class ListModule {}
