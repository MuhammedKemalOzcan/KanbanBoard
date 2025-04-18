import { Board } from 'src/boards/boards.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => Board, (board) => board.cards, { onDelete: 'CASCADE' })
  board: Board;

  @Column()
  boardId: number;
}
