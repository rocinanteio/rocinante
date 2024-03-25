import { Injectable } from '@nestjs/common';
import { DockerGeneratorService } from './docker/docker-generator.service';
import { Project } from '../projects/model/project';
import { K8sGeneratorService } from './k8s/k8s-generator.service';
import { ConfigGeneratorService } from './config/config-generator.service';
import { ProjectImage } from '../projects/model/project-image';

@Injectable()
export class GeneratorService {
  constructor(
    private readonly dockerGeneratorService: DockerGeneratorService,
    private readonly k8sGeneratorService: K8sGeneratorService,
    private readonly configGeneratorService: ConfigGeneratorService,
  ) {}
  async generateProject(project: Project) {
    const config = this.configGeneratorService.parseConfigs(project);
    const dockerFile = await this.dockerGeneratorService.build(project);
    await this.k8sGeneratorService.generateObjects(dockerFile, config);
  }

  generateProjectWithImage(project: ProjectImage) {
    return this.k8sGeneratorService.generateObjectsProjectImage(project);
  }
}
