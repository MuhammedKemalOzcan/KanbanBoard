import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from './list.entity';
import { Board } from 'src/boards/boards.entity';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async getListsByBoard(boardId: string): Promise<List[]> {
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
      relations: ['lists', 'lists.cards'],
    });

    if (!board) {
      throw new NotFoundException(`Board ${boardId} bulunamadı`);
    }

    return board.lists;
  }

  // ID'ye göre bir listeyi getirme
  async getOneList(id: string): Promise<List> {
    const list = await this.listRepository.findOne({
      where: { id: id },
    });

    if (!list) {
      throw new NotFoundException(`Liste ${id} bulunamadı`);
    }

    return list;
  }
}
