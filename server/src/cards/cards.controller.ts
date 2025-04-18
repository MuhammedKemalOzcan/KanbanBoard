import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './create-card.dto';
import { Card } from './cards.entity';
import { UpdateCardDto } from './update-card.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardService: CardsService) {}

  @Post()
  create(@Body() createCardDto: CreateCardDto): Promise<Card> {
    return this.cardService.create(createCardDto);
  }

  @Get()
  findAll(): Promise<Card[]> {
    return this.cardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Card | null> {
    return this.cardService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateCardDto: CreateCardDto,
  ): Promise<Card | null> {
    return this.cardService.update(id, updateCardDto);
  }

  @Patch(':id')
  async updateCard(
    @Param('id') id: number,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return this.cardService.updateCard(id, updateCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.cardService.remove(id);
  }
}
