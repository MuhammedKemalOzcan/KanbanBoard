import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './cards.entity';
import { List } from 'src/lists/list.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
  ) {}

  async createCard(
    listId: string,
    title: string,
    description?: string,
  ): Promise<Card> {
    const list = await this.listRepository.findOneBy({ id: listId });
    if (!list) {
      throw new Error('List not found');
    }

    const card = this.cardRepository.create({ title, description, list });
    return this.cardRepository.save(card);
  }

  async getCardsByList(listId: string): Promise<Card[]> {
    //belli bir listeye ait tüm kartları getirir.
    const list = await this.listRepository.findOne({
      where: { id: listId },
      relations: ['cards'],
    });

    if (!list) {
      throw new Error('List not found');
    }

    return list.cards;
  }

  async moveCard(cardId: string, targetListId: string): Promise<Card> {
    const card = await this.cardRepository.findOne({
      where: { id: cardId },
      relations: ['list'],
    });

    if (!card) {
      throw new Error('Card not found');
    }

    const targetList = await this.listRepository.findOneBy({
      id: targetListId,
    });
    if (!targetList) {
      throw new Error('Target list not found');
    }

    //kartın list ilişkisi değiştirilir.
    card.list = targetList;
    return this.cardRepository.save(card);
  }

  async deleteCardById(id: string): Promise<void> {
    const card = await this.cardRepository.findOne({
      where: { id: id },
    });

    if (!card) {
      throw new NotFoundException(`Kart ID: ${id} bulunamadı`);
    }

    await this.cardRepository.remove(card);
  }

  async updateCardById(id: string, updateData: Partial<Card>): Promise<Card> {
    const card = await this.cardRepository.findOne({ where: { id } });

    if (!card) {
      throw new NotFoundException(`Kart ID: ${id} bulunamadı`);
    }

    // Verilen updateData ile kartı güncelliyoruz
    Object.assign(card, updateData);

    return this.cardRepository.save(card);
  }
}
