import { Module } from '@nestjs/common';
import { GitHubController } from './github.controller';
import { GithubAdapter } from './github.adapter';
import { GithubService } from './github.service';

@Module({
  imports: [],
  providers: [GithubAdapter, GithubService],
  controllers: [GitHubController],
})
export class GithubModule {}
