import { K8sDeploymentObject } from './k8s-deployment-object';
import { K8sServiceObject } from './k8s-service-object';
import { DockerFile } from '../../docker/models/docker.file';
import { AppConfig } from '../../config/models/app.config';
import { ProjectConfig } from '../../config/models/project.config';
import { K8sConfig } from '../configs/k8s.config';
import { ProjectImage } from '../../../projects/model/project-image';

export class K8sObject {
  public deployment: K8sDeploymentObject;
  public service: K8sServiceObject;
  public server: string;

  constructor(
    public readonly projectName: string,
    public readonly projectImage: string,
    public readonly projectPort: number,
    public readonly projectNamespace: string,
  ) {
    this.deployment = new K8sDeploymentObject();
    this.service = new K8sServiceObject();
  }

  static from(
    dockerizedProject: DockerFile,
    config: AppConfig,
    projectConfig: ProjectConfig,
  ): K8sObject {
    return new K8sObject(
      dockerizedProject.imageName.replace('/', '-').replace(':', '-'),
      `${dockerizedProject.imageName}`,
      config.port,
      projectConfig.projectNamespace,
    );
  }

  static fromProjectImage(project: ProjectImage, projectConfig: ProjectConfig) {
    return new K8sObject(
      project.name,
      project.image,
      project.port,
      projectConfig.projectNamespace,
    );
  }

  setServer(server: string) {
    this.server = server;

    return this;
  }

  generateDeployment(config: K8sConfig) {
    this.deployment.generateFromTemplate(this, this.projectImage, config);

    return this;
  }

  generateService(nodePort: number, config: K8sConfig) {
    this.service.generateFromTemplate(
      this,
      this.projectImage,
      nodePort,
      config,
    );

    return this;
  }
}
