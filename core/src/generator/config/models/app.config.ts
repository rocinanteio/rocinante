import { Project } from '../../../projects/model/project';
import { readFileFullPath } from '../../../shared/utils/fs.utils';
import { ConfigParseError } from '../exceptions/ConfigParseError';
import { PortConfigNotExistException } from '../exceptions/PortConfigNotExistException';

const ConfigFileName = '.roci-reviewapp.config.json';

export class AppConfig {
  port: number;

  static parse(project: Project): AppConfig {
    let config: AppConfig;
    try {
      const configs = readFileFullPath(`${project.path}/${ConfigFileName}`);

      config = JSON.parse(configs.toString());
    } catch (e) {
      throw new ConfigParseError();
    }

    if (!config?.port) {
      throw new PortConfigNotExistException();
    }

    return config;
  }
}
