import { Module } from '@nestjs/common';
import { K8sGeneratorService } from './k8s-generator.service';
import { K8sGeneratorGateway } from './k8s-generator.gateway';

@Module({
  providers: [K8sGeneratorService, K8sGeneratorGateway],
  exports: [K8sGeneratorService],
  imports: [],
})
export class K8sGeneratorModule {}
