import { Injectable } from '@nestjs/common';
import { GitlabAdapter } from './gitlab.adapter';
import { GetProjectsQueryDto } from './dto/get-projects-query.dto';
import { GitlabProjectsResponseDto } from './dto/gitlab-projects-response.dto';
import { GitlabMapper } from './gitlab.mapper';

@Injectable()
export class GitlabService {
  constructor(
    private readonly gitlabAdapter: GitlabAdapter,
    private readonly gitlabMapper: GitlabMapper,
  ) {}
  async getProjects(
    query: GetProjectsQueryDto,
  ): Promise<GitlabProjectsResponseDto> {
    const projects = await this.gitlabAdapter.getProjects(query);
    return this.gitlabMapper.mapProjects(projects);
  }
}
