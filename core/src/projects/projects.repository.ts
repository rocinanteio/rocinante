import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProjectEntity } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './model/project';
import { getProjectsPath } from '../shared/utils/project.utils';
import { ProjectImage } from './model/project-image';
import { ProjectImageEntity } from './entities/project-image.entity';
import { K8sObject } from '../generator/k8s/models/k8s-object';

@Injectable()
export class ProjectsRepository {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly entityRepository: Repository<ProjectEntity>,
    @InjectRepository(ProjectImageEntity)
    private readonly projectImageEntityRepository: Repository<ProjectImageEntity>,
  ) {}

  async save(project: Project) {
    const entity = new ProjectEntity();
    entity.name = project.name;
    entity.version = project.version;
    entity.relativePath = `${getProjectsPath()}/${project.name}/${
      project.version
    }`;
    entity.repoUrl = '';

    await this.entityRepository.save(entity);
  }

  async saveImage(project: ProjectImage, object: K8sObject) {
    const entity = new ProjectImageEntity();
    entity.name = project.name;
    entity.image = project.image;
    entity.appPort = project.port;
    entity.host = `${object.server}:${object.service.nodePort}`;

    await this.projectImageEntityRepository.save(entity);

    return entity;
  }

  async removeProjectImage(project: ProjectImage) {
    await this.projectImageEntityRepository
      .createQueryBuilder()
      .delete()
      .where('name = :name', { name: project.name })
      .andWhere('image = :image', { image: project.image })
      .andWhere('appPort = :appPort', { appPort: project.port })
      .execute();
  }

  async getAll() {
    return this.projectImageEntityRepository.find();
  }
}
