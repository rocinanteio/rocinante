import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GithubAdapter {
  public async getRepositories(organizationName: string) {
    const url = `https://api.github.com/orgs/${organizationName}/repos`;
    const response = await axios.get(url);
    return response.data;
  }
  public async getRepository(repositoryOwner: string, repositoryName: string) {
    const url = this.urlGenerator('repos', [repositoryOwner, repositoryName]);
    const response = await axios.get(url);
    return response.data;
  }
  public async getBranches(repositoryOwner: string, repositoryName: string) {
    const url = this.urlGenerator('repos', [
      repositoryOwner,
      repositoryName,
      'branches',
    ]);
    const response = await axios.get(url);
    return response.data;
  }
  public async getBranchCommit(
    repositoryOwner: string,
    repositoryName: string,
    branchName: string,
  ) {
    const url = this.urlGenerator('repos', [
      repositoryOwner,
      repositoryName,
      'branches',
      branchName,
    ]);
    const response = await axios.get(url);
    return response.data;
  }

  private urlGenerator(base: string, params: string[]): string {
    let githubUrl = `https://api.github.com/${base}`;

    params.forEach((param) => {
      githubUrl += `/${param}`;
    });

    return githubUrl;
  }
}
