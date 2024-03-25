import { Project } from '../../../projects/model/project';
import { DOCKERFILE_NAME } from '../../../shared/constants';
import { DockerSetup } from '../models/docker-setup.model';

export const generateImageName = (
  project: Project,
  hash: string,
  setup: DockerSetup,
) =>
  `${setup.imagePrefix}/roci-reviewapp-${hash}-${project.name}:${project.version}`;

export const DockerCommands = {
  LOGIN: (setup: DockerSetup) =>
    `docker login -u ${setup.configs.user} -p ${setup.configs.password} ${setup.configs.server}`,
  LOGOUT: () => `docker logout`,
  BUILD: (path: string, imageName: string) =>
    `docker build -t ${imageName} -f ${path}/${DOCKERFILE_NAME} ${path}`,
  PUSH: (imageName: string) => `docker push ${imageName}`,
};
