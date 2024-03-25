import { Injectable } from '@nestjs/common';
import { GeneratorService } from '../generator/generator.service';
import { Project } from './model/project';
import { CreateProjectsDto } from './dtos/create-project.dto';
import { ProjectsRepository } from './projects.repository';
import { K8sService } from '../k8s/k8s.service';
import { StartProjectWithImageDto } from './dtos/start-project-with-image.dto';
import { ProjectImage } from './model/project-image';
import { ProjectsGateway } from './projects.gateway';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly generatorService: GeneratorService,
    private readonly projectsRepository: ProjectsRepository,
    private readonly k8sService: K8sService,
    private readonly projectsGateway: ProjectsGateway,
  ) {}

  async startApp(name: string, version: string) {
    const project = new Project(name, version);
    await this.generatorService.generateProject(project);
  }

  async create(body: CreateProjectsDto) {
    for (const project of body.projects) {
      await this.projectsRepository.save(
        new Project(project.name, project.version),
      );
    }
  }

  getAll() {
    return this.projectsRepository.getAll();
  }

  async startAppWithImage(body: StartProjectWithImageDto) {
    const image = new ProjectImage(body.name, body.image, body.appPort);

    this.projectsGateway.sendEvent(
      body.name,
      `Project ${body.name} started to created`,
    );
    const k8sObject = await this.generatorService.generateProjectWithImage(
      image,
    );

    const response = await this.projectsRepository.saveImage(image, k8sObject);
    this.projectsGateway.sendEvent(image.name, `${image.name} saved in db`);
    this.projectsGateway.sendEvent(
      body.name,
      `Project ${body.name} review app created successfully`,
    );

    return response;
  }

  async stopAppWithImage(body: StartProjectWithImageDto) {
    try {
      const image = new ProjectImage(body.name, body.image, body.appPort);
      this.projectsGateway.sendEvent(body.name, `${body.name} will be stopped`);
      await this.k8sService.stopReviewApp(body.name);
      await this.projectsRepository.removeProjectImage(image);
      this.projectsGateway.sendEvent(body.name, `${body.name} is stopped`);
    } catch (e) {
      return e;
    }
  }

  async getAllPipelineProjects() {
    return this.projectsRepository.getAll();
  }
}
