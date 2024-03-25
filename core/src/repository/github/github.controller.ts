import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GithubService } from './github.service';
import { executeCommand } from '../../shared/utils/spawn.utils';
import { FetchRepositoryPayload } from './types/fetch-repository-payload';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('/github')
export class GitHubController {
  constructor(private readonly githubService: GithubService) {}
  @Get('/orgs/:organizationName/repos')
  @ApiOperation({
    summary: 'Get Repositories',
    description: 'Fetches all repos of an organization',
  })
  @ApiParam({
    name: 'organizationName',
    description:
      'This is the name of the organization whose repo you want to view',
  })
  public async getRepositories(
    @Param('organizationName') organizationName: string,
  ) {
    return this.githubService.getRepositories(organizationName);
  }
  @Get('/repository/:repositoryOwner/:repositoryName')
  @ApiOperation({
    summary: 'Get Repository',
    description:
      'Fetches whichever repo you want to go to under an organization',
  })
  @ApiParam({
    name: 'repositoryOwner',
    description:
      'This is the name of the organization whose repo you want to view',
  })
  @ApiParam({
    name: 'repositoryName',
    description:
      'This is the name of the organization whose repo you want to view. For example maybe you want to see Spotifys Voyager repository',
  })
  public async getRepository(
    @Param('repositoryOwner') repositoryOwner: string,
    @Param('repositoryName') repositoryName: string,
  ) {
    return this.githubService.getRepository(repositoryOwner, repositoryName);
  }
  @Get('/branches/:repositoryOwner/:repositoryName')
  @ApiOperation({
    summary: 'Get Branches',
    description: 'Retrieves the contents of a branch under a repository',
  })
  @ApiParam({
    name: 'repositoryOwner',
    description:
      'This is the name of the organization whose repo you want to view',
  })
  @ApiParam({
    name: 'repositoryName',
    description:
      'This is the name of the organization whose branch you want to view. For example maybe you want to see Spotifys x branches',
  })
  public async getBranches(
    @Param('repositoryOwner') repositoryOwner: string,
    @Param('repositoryName') repositoryName: string,
  ) {
    return this.githubService.getBranches(repositoryOwner, repositoryName);
  }
  @Get('/branches/:repositoryOwner/:repositoryName/:branchName')
  @ApiOperation({
    summary: 'Get Branches Commit',
    description: 'Fetches commits under Branch',
  })
  @ApiParam({
    name: 'repositoryOwner',
    description:
      'This is the name of the organization whose repo you want to view',
  })
  @ApiParam({
    name: 'repositoryName',
    description:
      'This is the name of the organization whose branch you want to view. For example maybe you want to see Spotifys x branches',
  })
  @ApiParam({
    name: 'repositoryName',
    description:
      'This is the name of the organization whose branch you want to view. For example maybe you want to see Spotifys x branches',
  })
  public async getBranchCommit(
    @Param('repositoryOwner') repositoryOwner: string,
    @Param('repositoryName') repositoryName: string,
    @Param('branchName') branchName: string,
  ) {
    return this.githubService.getBranchCommit(
      repositoryOwner,
      repositoryName,
      branchName,
    );
  }

  @Post()
  @ApiOperation({
    summary: 'Post Get Branches',
    description: 'Brings the code under the related branch to the local',
  })
  public async fetchRepository(@Body() payload: FetchRepositoryPayload) {
    await executeCommand({
      command: `git clone https://github.com/${payload.organizationName}/${payload.projectName}.git`,
      stdOutHandler: (message) => {
        console.log(message);
      },
      stdErrHandler: (message) => {
        console.log(message);
      },
    });
  }
}
