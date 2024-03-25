import { Controller, Get, Query } from '@nestjs/common';
import { GitlabService } from './gitlab.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GitlabProjectsResponseDto } from './dto/gitlab-projects-response.dto';
import { GetProjectsQueryDto } from './dto/get-projects-query.dto';

@Controller('/repo/gitlab')
@ApiTags('gitlab-repo')
export class GitlabController {
  constructor(private gitlabService: GitlabService) {}
  @Get('/projects')
  @ApiOperation({
    summary: 'Get Membership Projects',
  })
  getProjects(
    @Query() query: GetProjectsQueryDto,
  ): Promise<GitlabProjectsResponseDto> {
    return this.gitlabService.getProjects(query);
  }
}
