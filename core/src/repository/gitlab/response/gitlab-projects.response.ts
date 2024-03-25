export interface GitlabProjectsResponse {
  id: number;
  description: string;
  name: string;
  name_with_namespace: string;
  path: string;
  path_with_namespace: string;
  created_at: string;
  default_branch: string;
  tag_list: any[];
  topics: any[];
  ssh_url_to_repo: string;
  http_url_to_repo: string;
  web_url: string;
  readme_url: string;
  avatar_url: any;
  forks_count: number;
  star_count: number;
  last_activity_at: string;
  namespace: Namespace;
  container_registry_image_prefix: string;
  _links: Links;
  packages_enabled: boolean;
  empty_repo: boolean;
  archived: boolean;
  visibility: string;
  resolve_outdated_diff_discussions: boolean;
  container_expiration_policy: ContainerExpirationPolicy;
  issues_enabled: boolean;
  merge_requests_enabled: boolean;
  wiki_enabled: boolean;
  jobs_enabled: boolean;
  snippets_enabled: boolean;
  container_registry_enabled: boolean;
  service_desk_enabled: boolean;
  service_desk_address: string;
  can_create_merge_request_in: boolean;
  issues_access_level: string;
  repository_access_level: string;
  merge_requests_access_level: string;
  forking_access_level: string;
  wiki_access_level: string;
  builds_access_level: string;
  snippets_access_level: string;
  pages_access_level: string;
  operations_access_level: string;
  analytics_access_level: string;
  container_registry_access_level: string;
  security_and_compliance_access_level: string;
  emails_disabled: any;
  shared_runners_enabled: boolean;
  lfs_enabled: boolean;
  creator_id: number;
  import_url: any;
  import_type: any;
  import_status: string;
  open_issues_count: number;
  ci_default_git_depth: number;
  ci_forward_deployment_enabled: boolean;
  ci_job_token_scope_enabled: boolean;
  ci_separated_caches: boolean;
  public_jobs: boolean;
  build_timeout: number;
  auto_cancel_pending_pipelines: string;
  build_coverage_regex: any;
  ci_config_path: string;
  shared_with_groups: any[];
  only_allow_merge_if_pipeline_succeeds: boolean;
  allow_merge_on_skipped_pipeline: boolean;
  restrict_user_defined_variables: boolean;
  request_access_enabled: boolean;
  only_allow_merge_if_all_discussions_are_resolved: boolean;
  remove_source_branch_after_merge: boolean;
  printing_merge_request_link_enabled: boolean;
  merge_method: string;
  squash_option: string;
  enforce_auth_checks_on_uploads: boolean;
  suggestion_commit_message: string;
  merge_commit_template: any;
  squash_commit_template: any;
  auto_devops_enabled: boolean;
  auto_devops_deploy_strategy: string;
  autoclose_referenced_issues: boolean;
  keep_latest_artifact: boolean;
  runner_token_expiration_interval: any;
  approvals_before_merge: number;
  mirror: boolean;
  external_authorization_classification_label: any;
  marked_for_deletion_at: any;
  marked_for_deletion_on: any;
  requirements_enabled: boolean;
  requirements_access_level: string;
  security_and_compliance_enabled: boolean;
  compliance_frameworks: any[];
  issues_template: any;
  merge_requests_template: string;
  merge_pipelines_enabled: boolean;
  merge_trains_enabled: boolean;
  permissions: Permissions;
}

export interface Namespace {
  id: number;
  name: string;
  path: string;
  kind: string;
  full_path: string;
  parent_id: number;
  avatar_url: string;
  web_url: string;
}

export interface Links {
  self: string;
  issues: string;
  merge_requests: string;
  repo_branches: string;
  labels: string;
  events: string;
  members: string;
  cluster_agents: string;
}

export interface ContainerExpirationPolicy {
  cadence: string;
  enabled: boolean;
  keep_n: number;
  older_than: string;
  name_regex: string;
  name_regex_keep: string;
  next_run_at: string;
}

export interface Permissions {
  project_access: any;
  group_access: any;
}
