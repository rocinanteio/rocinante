import { Global, Module } from '@nestjs/common';
import { K8sService } from './k8s.service';
import { K8sAdapter } from './k8s.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeploymentEntity } from './entities/deployment.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([DeploymentEntity])],
  providers: [K8sService, K8sAdapter],
  exports: [K8sService],
})
export class K8sModule {}
