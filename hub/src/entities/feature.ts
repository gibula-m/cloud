import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm";
import { Service } from "./service";

@Entity()
@Unique("feature_uniques", ["name"])
export class Feature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: string;

  @Column({ default: false })
  isActive: boolean;

  @ManyToOne(() => Service, { eager: true })
  @JoinColumn()
  service: Service;
}
