import { Injectable } from '@nestjs/common';
import { GitlabProjectsResponseDto } from './dto/gitlab-projects-response.dto';
import { GitlabProjectsResponse } from './response/gitlab-projects.response';

@Injectable()
export class GitlabMapper {
  mapProjects(projects: GitlabProjectsResponse[]): GitlabProjectsResponseDto {
    return {
      results: projects.map((project) => ({
        archived: project.archived,
        created_at: project.created_at,
        default_branch: project.default_branch,
        description: project.description,
        empty_repo: project.empty_repo,
        http_url_to_repo: project.http_url_to_repo,
        name: project.name,
        packages_enabled: project.packages_enabled,
        path_with_namespace: project.path_with_namespace,
        readme_url: project.readme_url,
        web_url: project.web_url,
        visibility: project.visibility,
        id: project.id,
      })),
    };
  }
}
