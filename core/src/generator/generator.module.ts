import { Module } from '@nestjs/common';
import { GeneratorService } from './generator.service';
import { DockerGeneratorModule } from './docker/docker-generator.module';
import { K8sGeneratorModule } from './k8s/k8s-generator.module';
import { ConfigGeneratorModule } from './config/config-generator.module';

@Module({
  providers: [GeneratorService],
  exports: [GeneratorService],
  imports: [DockerGeneratorModule, K8sGeneratorModule, ConfigGeneratorModule],
})
export class GeneratorModule {}
