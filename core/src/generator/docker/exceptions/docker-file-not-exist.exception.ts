import { BadRequestException } from '@nestjs/common';

export class DockerFileNotExistException extends BadRequestException {
  constructor() {
    super({
      key: 'docker.file.not.found',
      message: 'Dockerfile.review file not found. Please check it',
    });
  }
}
