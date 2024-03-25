import { Injectable, Logger } from '@nestjs/common';
import { DockerFile } from './models/docker.file';
import { Project } from '../../projects/model/project';
import { DockerEventsGateway } from './docker-events.gateway';
import { DockerConfigProvider } from './configs/docker-config-provider';
import { DockerSetup } from './models/docker-setup.model';

@Injectable()
export class DockerGeneratorService {
  constructor(
    private readonly dockerEvents: DockerEventsGateway,
    private logger: Logger,
    private readonly dockerConfigProvider: DockerConfigProvider,
  ) {
    this.handler = this.handler.bind(this);
  }

  async build(project: Project): Promise<DockerFile> {
    const dockerfile = new DockerFile(
      project,
      DockerSetup.init(this.dockerConfigProvider),
    );

    const handler = (data: string) => {
      this.handler(data, project.name);
    };

    handler('Docker Login');
    await dockerfile.login(handler);

    handler('Docker Build Started');
    await dockerfile.build(project, handler);
    handler('Docker Build Completed');

    handler('Docker Registry Push Started');
    await dockerfile.push(project, handler);
    handler('Docker Registry Push Completed');

    await dockerfile.logout(handler);
    handler('Dockerize Step Completed');
    handler(`Created Image ====> ${dockerfile.imageName}`);

    return dockerfile;
  }

  private handler(data: string, projectName: string) {
    this.logger.debug(data);
    this.dockerEvents.sendEvent(data, projectName);
  }
}
