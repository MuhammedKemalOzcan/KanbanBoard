import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { CardService } from './cards.service';
import { Card } from './cards.entity';

@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post(':listId')
  async createCard(
    @Param('listId') listId: string,
    @Body('title') title: string,
    @Body('description') description?: string,
  ) {
    return this.cardService.createCard(listId, title, description);
  }

  @Get(':listId')
  async getCards(@Param('listId') listId: string) {
    return this.cardService.getCardsByList(listId);
  }

  @Patch('move/:cardId')
  async moveCard(
    @Param('cardId') cardId: string,
    @Body('targetListId') targetListId: string,
  ) {
    return this.cardService.moveCard(cardId, targetListId);
  }

  @Patch(':id')
  async updateCard(
    @Param('id') id: string,
    @Body() updateData: Partial<Card>,
  ): Promise<Card> {
    return this.cardService.updateCardById(id, updateData);
  }

  @Delete(':id')
  async deleteCard(@Param('id') id: string): Promise<{ message: string }> {
    await this.cardService.deleteCardById(id);
    return { message: `Kart ID: ${id} başarıyla silindi.` };
  }
}
