import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { K8sAdapter } from './k8s.adapter';
import { MaximumNodePort, MinimumNodePort } from './k8s.constants';
import { executeCommand } from '../shared/utils/spawn.utils';
import { K8SCommands } from './helpers/k8s-command.helper';
import { K8sObjectsEnum } from './models/k8s-objects.enum';
import { K8sConfigProviderConfig } from '../generator/k8s/configs/k8s-config-provider.config';

@Injectable()
export class K8sService {
  constructor(
    private readonly k8sAdapter: K8sAdapter,
    private readonly logger: Logger,
    private readonly k8sConfig: K8sConfigProviderConfig,
  ) {}
  apply(path: string) {
    return this.k8sAdapter.apply(path);
  }

  async getFreeNodePort() {
    const availableNodePorts = await this.k8sAdapter.getAvailableNodePorts();
    for (let i = MinimumNodePort; i < MaximumNodePort; i++) {
      if (!availableNodePorts.includes(i)) {
        return i;
      }
    }

    throw new BadRequestException('There isnt any empty nodePort');
  }

  async stopReviewApp(name: string) {
    const namespace = this.k8sConfig.namespace;
    await this.deleteDeployment(name, namespace);
    await this.deleteService(name, namespace);
  }

  getServer(): string {
    return this.k8sAdapter.getServerIp();
  }

  private async deleteDeployment(name: string, namespace: string) {
    await executeCommand({
      command: K8SCommands.DELETE(K8sObjectsEnum.Deployment, name, namespace),
      stdOutHandler: (log: string) => this.handler(log),
      stdErrHandler: (log: string) => this.handler(log),
      closeHandler: (log: string) => this.handler(log),
    });
  }

  private async deleteService(name: string, namespace: string) {
    await executeCommand({
      command: K8SCommands.DELETE(K8sObjectsEnum.Service, name, namespace),
      stdOutHandler: (log: string) => this.handler(log),
      stdErrHandler: (log: string) => this.handler(log),
      closeHandler: (log: string) => this.handler(log),
    });
  }

  private async handler(log: string) {
    this.logger.debug(`k8s service :: ${log}`);
  }
}
