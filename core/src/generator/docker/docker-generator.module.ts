import { Module } from '@nestjs/common';
import { DockerGeneratorService } from './docker-generator.service';
import { DockerEventsGateway } from './docker-events.gateway';

@Module({
  providers: [DockerGeneratorService, DockerEventsGateway],
  exports: [DockerGeneratorService],
})
export class DockerGeneratorModule {}
