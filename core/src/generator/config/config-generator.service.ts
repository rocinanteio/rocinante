import { Injectable } from '@nestjs/common';
import { Project } from '../../projects/model/project';
import { AppConfig } from './models/app.config';

@Injectable()
export class ConfigGeneratorService {
  parseConfigs(project: Project) {
    return AppConfig.parse(project);
  }
}
