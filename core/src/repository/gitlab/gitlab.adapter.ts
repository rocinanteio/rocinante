import axios from 'axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { GetProjectsQueryDto } from './dto/get-projects-query.dto';
import { GitlabProjectsResponse } from './response/gitlab-projects.response';

@Injectable()
export class GitlabAdapter {
  constructor(private readonly logger: Logger) {}
  async getProjects(query: GetProjectsQueryDto) {
    const params = new URLSearchParams();
    params.set('page', query.page.toString());
    params.set('per_page', query.perPage.toString());
    params.set('search', query.search);

    try {
      const response = await axios.get<GitlabProjectsResponse[]>(
        `https://gitlab.trendyol.com/api/v4/projects?${params}`,
        {
          headers: {
            'PRIVATE-TOKEN': '<private-token>',
          },
        },
      );

      return response.data;
    } catch (e) {
      this.logger.error('Gitlab projects fetch errors, e', e);
      throw new InternalServerErrorException(
        'An error occurred when fetching gitlab projects',
      );
    }
  }
}
