import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { BoardService } from './boards.service';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  async createBoard(@Body('name') name: string) {
    return this.boardService.createBoard(name);
  }

  @Get(':id')
  async getBoard(@Param('id') id: string) {
    return this.boardService.getBoardById(id);
  }
}
