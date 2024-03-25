import { ApiProperty } from '@nestjs/swagger';

export class GetProjectsQueryDto {
  @ApiProperty({ type: Number, default: 1 })
  page: number;
  @ApiProperty({ type: Number, default: 10 })
  perPage: number;
  @ApiProperty({ type: String, default: '', required: false })
  search: string;
}
