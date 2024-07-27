import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DeploymentEntity } from '../../k8s/entities/deployment.entity';

@Entity('project')
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  version: string;

  @Column()
  relativePath: string;

  @Column()
  repoUrl?: string;

  @OneToMany(() => DeploymentEntity, (deployment) => deployment.projectId)
  deployments: DeploymentEntity[];
}
