import { Injectable } from '@nestjs/common';
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
    console.log("debug 1")
    // Yeni board'ı oluşturuyoruz
    const board = this.boardRepository.create({ name });
    console.log("debug 2")
    await this.boardRepository.save(board);
    
    console.log("debug 3")

    // Default listeleri oluşturuyoruz
    const lists = ['Backlog', 'To Do', 'In Progress', 'Designed'];

    const listEntities = lists.map((listName) => {
      const list = this.listRepository.create({
        name: listName,
        board: board, // Her listeyi yeni oluşturulan board'a bağlıyoruz
      });
      console.log("LIST BURADA", list)
      return list;
    });

    
    console.log("debug 4")

    // Listeleri kaydediyoruz
    await this.listRepository.save(listEntities);

    
    console.log("debug 5")

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
}
