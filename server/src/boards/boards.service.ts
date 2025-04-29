import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './boards.entity';
import { List } from 'src/lists/list.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
  ) {}

  async createBoard(name: string): Promise<Board | null> {
    // Yeni board'ı oluşturuyoruz
    const board = this.boardRepository.create({ name });
    await this.boardRepository.save(board);

    // Default listeleri oluşturuyoruz
    const lists = ['Backlog', 'To Do', 'In Progress', 'Designed'];

    const listEntities = lists.map((listName) => {
      const list = this.listRepository.create({
        name: listName,
        board: board, // Her listeyi yeni oluşturulan board'a bağlıyoruz
      });
      return list;
    });

    // Listeleri kaydediyoruz
    await this.listRepository.save(listEntities);

    // Son olarak board'ı döndürüyoruz
    return this.boardRepository.findOne({
      where: { id: board.id },
      relations: ['lists'], // board ile ilişkili listeleri de getiriyoruz
    });
  }

  async getBoardById(id: string): Promise<Board | null> {
    return this.boardRepository.findOne({
      where: { id },
      relations: ['lists', 'lists.cards'],
    });
  }

  async getAllBoards(): Promise<Board[]> {
    const boards = await this.boardRepository.find({
      relations: ['lists', 'lists.cards'], // Board -> List -> Card ilişkilerini getiriyoruz
    });

    if (!boards || boards.length === 0) {
      throw new NotFoundException('Hiç board bulunamadı.');
    }

    return boards;
  }
}
