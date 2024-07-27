import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('project_image')
export class ProjectImageEntity {
  @PrimaryColumn()
  name: string;

  @PrimaryColumn()
  image: string;

  @PrimaryColumn()
  appPort: number;

  @Column()
  host: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
