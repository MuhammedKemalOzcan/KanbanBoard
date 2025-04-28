import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { List } from 'src/lists/list.entity'; 

@Entity()
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => List, (list) => list.cards, { onDelete: 'CASCADE' })
  list: List;
}
