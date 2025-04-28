import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './boards.entity';
import { BoardService } from './boards.service';
import { BoardController } from './boards.controller';
import { List } from 'src/lists/list.entity';
import { ListService } from 'src/lists/lists.service';

@Module({
  imports: [TypeOrmModule.forFeature([Board, List])],
  controllers: [BoardController],
  providers: [BoardService, ListService],
})
export class BoardModule {}
