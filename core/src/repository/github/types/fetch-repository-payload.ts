import { ApiProperty } from '@nestjs/swagger';

export class FetchRepositoryPayload {
  @ApiProperty({ example: 'voyager' })
  projectName: string;

  @ApiProperty({ example: 'spotify' })
  organizationName: string;

  @ApiProperty({ example: 'branchName' })
  branchName: string;
}
