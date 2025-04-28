import { Controller, Post, Get, Patch, Body, Param } from '@nestjs/common';
import { CardService } from './cards.service';

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
}
