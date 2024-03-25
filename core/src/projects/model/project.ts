import { getProjectsPath } from '../../shared/utils/project.utils';
import { checkFileExist } from '../../shared/utils/fs.utils';
import { BadRequestException } from '@nestjs/common';

export class Project {
  path: string;
  constructor(readonly name: string, readonly version: string) {
    this.path = `${getProjectsPath()}/${name}/${version}`;

    // TODO If project not exist, try to fetch from repo

    if (!checkFileExist(this.path)) {
      throw new BadRequestException('project not found');
    }
  }
}
