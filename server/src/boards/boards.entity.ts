import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { List } from 'src/lists/list.entity';

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ default: '' })
  slug: string; // public id olarak kullanılacak

  @Column()
  name: string;

  @OneToMany(() => List, (list) => list.board, { cascade: true })
  lists: List[];
}
