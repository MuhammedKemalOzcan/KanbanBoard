import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './cards.entity';
import { Repository } from 'typeorm';
import { CreateCardDto } from './create-card.dto';
import { Board } from 'src/boards/boards.entity';
import { UpdateCardDto } from './update-card.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepo: Repository<Card>,

    @InjectRepository(Board)
    private readonly boardRepo: Repository<Board>,
  ) {}

  async create(createCardDto: CreateCardDto): Promise<Card> {
    const board = await this.boardRepo.findOne({
      where: { id: createCardDto.boardId },
    });

    if (!board) {
      throw new NotFoundException('Board cannot found');
    }

    const card = this.cardRepo.create({
      title: createCardDto.title,
      description: createCardDto.description,
      board: board,
    });

    return await this.cardRepo.save(card);
  }

  async findAll() {
    return await this.cardRepo.find();
  }

  async findOne(id: number): Promise<Card | null> {
    return this.cardRepo.findOneBy({ id });
  }

  async updateCard(
    id: number,
    updateCardDto: UpdateCardDto,
  ): Promise<Card | null> {
    const card = await this.cardRepo.findOne({ where: { id } });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    Object.assign(card, updateCardDto);

    return this.cardRepo.save(card);

  }

  async update(id: number, updateCardDto: CreateCardDto) {
    await this.cardRepo.update(id, updateCardDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.cardRepo.delete(id);
  }
}
