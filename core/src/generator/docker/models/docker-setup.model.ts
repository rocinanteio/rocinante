import { DockerConfigProvider } from '../configs/docker-config-provider';

export class DockerSetup {
  imagePrefix = '';

  constructor(public configs: DockerConfigProvider) {
    this.setImagePrefix();
  }

  static init(provider: DockerConfigProvider) {
    return new DockerSetup(provider);
  }

  private setImagePrefix() {
    if (this.configs.server) {
      this.imagePrefix = `${this.configs.server}`;
    } else {
      this.imagePrefix = `${this.configs.user}`;
    }
  }
}
