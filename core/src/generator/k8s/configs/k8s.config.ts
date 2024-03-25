import { KubernetesObject } from '@kubernetes/client-node';
import { K8sConfigProviderConfig } from './k8s-config-provider.config';

import { BadRequestException } from '@nestjs/common';

export class K8sConfig {
  constructor(
    readonly overrideDeployment: KubernetesObject,
    readonly overrideService: KubernetesObject,
  ) {}

  static from(k8sConfigProvider: K8sConfigProviderConfig): K8sConfig {
    try {
      const deployment: KubernetesObject = JSON.parse(
        k8sConfigProvider.overrideDeployment,
      );

      const service: KubernetesObject = JSON.parse(
        k8sConfigProvider.overrideService,
      );

      return new K8sConfig(deployment, service);
    } catch (e) {
      throw new BadRequestException(
        'an error occurred when parsing deployment or service override object',
      );
    }
  }
}
