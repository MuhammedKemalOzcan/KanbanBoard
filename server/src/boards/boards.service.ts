import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './boards.entity';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './create-board.dto';

//Başka sınıflara inject edilebilecek
@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    const board = this.boardRepository.create(createBoardDto);
    return await this.boardRepository.save(board);
  }

  async findAll(): Promise<Board[]> {
    return await this.boardRepository.find({ relations: ['cards'] }); //board ile ilişkili olan kartların da gelemsini sağladık.
  }

  async remove(id: number) {
    await this.boardRepository.delete(id);
  }
}
