import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './cards.entity';
import { List } from 'src/lists/list.entity';
import { CardService } from './cards.service';
import { CardController } from './cards.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Card, List])],
  providers: [CardService],
  controllers: [CardController],
})
export class CardModule {}
