import { Module } from '@nestjs/common';
import { GitlabService } from './gitlab.service';
import { GitlabController } from './gitlab.controller';
import { GitlabAdapter } from './gitlab.adapter';
import { GitlabMapper } from './gitlab.mapper';

@Module({
  providers: [GitlabService, GitlabAdapter, GitlabMapper],
  controllers: [GitlabController],
})
export class GitlabModule {}
