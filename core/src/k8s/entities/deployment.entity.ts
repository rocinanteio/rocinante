import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectEntity } from '../../projects/entities/project.entity';

@Entity()
export class DeploymentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  @ManyToOne(() => ProjectEntity, (project) => project.deployments)
  projectId: number;

  @Column()
  isActive: boolean;
}
