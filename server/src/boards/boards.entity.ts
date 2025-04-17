import { Card } from 'src/cards/cards.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => Card, (card) => card.board, { cascade: true })
  cards: Card[];
}
