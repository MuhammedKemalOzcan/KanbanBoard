import { Controller, Post, Get, Body, Param, Delete } from '@nestjs/common';
import { ListService } from './lists.service';

@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get('board/:boardId')
  async getLists(@Param('boardId') boardId: string) {
    return this.listService.getListsByBoard(boardId);
  }

  @Get(':id')
  async getOneList(@Param('id') id: string) {
    return this.listService.getOneList(id);
  }

  
}
