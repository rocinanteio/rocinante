import { DOCKERFILE_NAME } from '../../../shared/constants';

import { DockerFileNotExistException } from '../exceptions/docker-file-not-exist.exception';
import { checkFileExist } from '../../../shared/utils/fs.utils';
import {
  DockerCommands,
  generateImageName,
} from '../helpers/docker-command.helpers';
import { Project } from '../../../projects/model/project';
import { executeCommand } from '../../../shared/utils/spawn.utils';
import { DockerSetup } from './docker-setup.model';
export class DockerFile {
  public dockerHash = new Date().getTime();
  public imageName = '';
  public server = '';

  constructor(
    private readonly project: Project,
    private readonly dockerSetup: DockerSetup,
  ) {
    if (!checkFileExist(`${this.project.path}/${DOCKERFILE_NAME}`)) {
      throw new DockerFileNotExistException();
    }

    this.imageName = generateImageName(
      project,
      this.dockerHash.toString(),
      this.dockerSetup,
    );
  }

  async build(project: Project, stdOutHandler: (s: string) => void) {
    await executeCommand({
      command: DockerCommands.BUILD(this.project.path, this.imageName),
      stdOutHandler,
      stdErrHandler: stdOutHandler,
    });
  }

  async push(project: Project, stdOutHandler: (s: string) => void) {
    await executeCommand({
      command: DockerCommands.PUSH(this.imageName),
      stdOutHandler,
      stdErrHandler: stdOutHandler,
    });
  }

  async login(stdOutHandler: (s: string) => void) {
    await executeCommand({
      command: DockerCommands.LOGIN(this.dockerSetup),
      stdOutHandler,
      stdErrHandler: stdOutHandler,
    });
  }

  async logout(stdOutHandler: (s: string) => void) {
    await executeCommand({
      command: DockerCommands.LOGOUT(),
      stdOutHandler,
      stdErrHandler: stdOutHandler,
    });
  }
}
