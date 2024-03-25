import { Injectable } from '@nestjs/common';
import { GithubAdapter } from './github.adapter';

@Injectable()
export class GithubService {
  constructor(private readonly githubAdapter: GithubAdapter) {}
  public async getRepositories(organizationName: string) {
    return this.githubAdapter.getRepositories(organizationName);
  }
  public async getRepository(repositoryOwner: string, repositoryName: string) {
    return this.githubAdapter.getRepository(repositoryOwner, repositoryName);
  }
  public async getBranches(repositoryOwner: string, repositoryName: string) {
    return this.githubAdapter.getBranches(repositoryOwner, repositoryName);
  }
  public async getBranchCommit(
    repositoryOwner: string,
    repositoryName: string,
    branchName: string,
  ) {
    return this.githubAdapter.getBranchCommit(
      repositoryOwner,
      repositoryName,
      branchName,
    );
  }
}
