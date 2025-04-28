import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ListService } from './lists.service';

@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post(':boardSlug')
  async createList(
    @Param('boardSlug') boardSlug: string,
    @Body('name') name: string,
  ) {
    return this.listService.createList(boardSlug, name);
  }

  @Get(':boardSlug')
  async getLists(@Param('boardSlug') boardSlug: string) {
    return this.listService.getListsByBoard(boardSlug);
  }
}
