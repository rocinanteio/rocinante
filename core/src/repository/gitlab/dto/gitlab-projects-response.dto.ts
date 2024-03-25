export class GitlabProjectsResponseDto {
  results: GitlabProjectsModel[];
}

export class GitlabProjectsModel {
  id: number;
  description: string;
  name: string;
  path_with_namespace: string;
  created_at: string;
  default_branch: string;
  http_url_to_repo: string;
  web_url: string;
  readme_url: string;
  packages_enabled: boolean;
  empty_repo: boolean;
  archived: boolean;
  visibility: string;
}
