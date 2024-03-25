import { Global, Module } from '@nestjs/common';
import { DockerConfigProvider } from './generator/docker/configs/docker-config-provider';
import { ConfigService } from '@nestjs/config';
import { K8sConfigProviderConfig } from './generator/k8s/configs/k8s-config-provider.config';

@Global()
@Module({
  providers: [
    {
      provide: DockerConfigProvider,
      useFactory: (configService: ConfigService): DockerConfigProvider => ({
        server: configService.get('DOCKER_SERVER'),
        user: configService.get('DOCKER_USER'),
        password: configService.get('DOCKER_PASSWORD'),
      }),
      inject: [ConfigService],
    },
    {
      provide: K8sConfigProviderConfig,
      useFactory: (configService: ConfigService): K8sConfigProviderConfig => ({
        overrideDeployment: configService.get('K8S_DEPLOYMENT_OVERRIDE'),
        overrideService: configService.get('K8S_SERVICE_OVERRIDE'),
        namespace: configService.get('REVIEWAPP_NAMESPACE'),
      }),
      inject: [ConfigService],
    },
  ],
  exports: [DockerConfigProvider, K8sConfigProviderConfig],
})
export class ConfigurationModule {}
