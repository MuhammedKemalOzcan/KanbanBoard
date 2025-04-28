import { Injectable } from '@nestjs/common';
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

  async createList(boardSlug: string, name: string): Promise<List> {
    const board = await this.boardRepository.findOneBy({ slug: boardSlug });
    if (!board) {
      throw new Error('Board not found');
    }

    const list = this.listRepository.create({ name, board });
    return this.listRepository.save(list);
  }

  async getListsByBoard(boardSlug: string): Promise<List[]> {
    const board = await this.boardRepository.findOne({
      where: { slug: boardSlug },
      relations: ['lists', 'lists.cards'],
    });

    if (!board) {
      throw new Error('Board not found');
    }

    return board.lists;
  }
}
