import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { K8sObject } from './models/k8s-object';
import { K8sService } from '../../k8s/k8s.service';
import { DockerFile } from '../docker/models/docker.file';
import { AppConfig } from '../config/models/app.config';
import { ConfigService } from '@nestjs/config';
import { K8sConfigProviderConfig } from './configs/k8s-config-provider.config';
import { K8sConfig } from './configs/k8s.config';
import { ProjectImage } from '../../projects/model/project-image';
import { K8sGeneratorGateway } from './k8s-generator.gateway';

@Injectable()
export class K8sGeneratorService {
  constructor(
    private readonly k8sService: K8sService,
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly k8sConfigProvider: K8sConfigProviderConfig,
    private readonly k8sGeneratorGateway: K8sGeneratorGateway,
  ) {}
  async generateObjects(dockerizedProject: DockerFile, configs: AppConfig) {
    try {
      this.logger.debug('k8s objects creation started');
      const object = K8sObject.from(dockerizedProject, configs, {
        projectNamespace: this.configService.get('REVIEWAPP_NAMESPACE'),
      });
      this.logger.debug('k8s created object configs', object);
      const nodePort = await this.k8sService.getFreeNodePort();
      this.logger.debug('k8s founded empty port:', nodePort);
      const k8sConfig = K8sConfig.from(this.k8sConfigProvider);
      object.generateDeployment(k8sConfig).generateService(nodePort, k8sConfig);

      await this.k8sService.apply(
        `${process.cwd()}${object.deployment.filePath}`,
      );

      this.logger.debug('k8s applied deployment');
      await this.k8sService.apply(`${process.cwd()}${object.service.filePath}`);
      this.logger.debug('k8s applied service');
      this.logger.debug('k8s stage completed');
    } catch (e) {
      const message = e?.body?.message || 'an error occurred when k8s proceses';
      this.logger.error(message);
      throw new BadRequestException(message);
    }
  }

  async generateObjectsProjectImage(project: ProjectImage): Promise<K8sObject> {
    try {
      const handleLogs = (data: string) => {
        this.handleLogs(project.name, data);
      };

      handleLogs('k8s objects creation started');
      const object = K8sObject.fromProjectImage(project, {
        projectNamespace: this.configService.get('REVIEWAPP_NAMESPACE'),
      });
      handleLogs(`k8s created object configs ${JSON.stringify(object)}`);
      const nodePort = await this.k8sService.getFreeNodePort();
      object.setServer(this.k8sService.getServer());
      handleLogs(`k8s founded empty port: ${nodePort}`);
      const k8sConfig = K8sConfig.from(this.k8sConfigProvider);
      object.generateDeployment(k8sConfig).generateService(nodePort, k8sConfig);

      await this.k8sService.apply(
        `${process.cwd()}${object.deployment.filePath}`,
      );

      handleLogs('k8s applied deployment');
      await this.k8sService.apply(`${process.cwd()}${object.service.filePath}`);
      handleLogs('k8s applied service');
      handleLogs('k8s stage completed');

      return object;
    } catch (e) {
      const message = e?.body?.message || 'an error occurred when k8s proceses';
      this.logger.error(message);
      throw new InternalServerErrorException(message);
    }
  }

  private handleLogs(topic: string, data: string) {
    this.logger.debug(data);
    this.k8sGeneratorGateway.sendEvent(topic, data);
  }
}
