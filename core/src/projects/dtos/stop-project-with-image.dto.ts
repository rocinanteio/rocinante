import { ApiProperty } from '@nestjs/swagger';

export class StartProjectWithImageDto {
  @ApiProperty({ type: String, required: true })
  name: string;

  @ApiProperty({ type: String, required: true })
  image: string;

  @ApiProperty({ type: Number, required: true })
  appPort: number;
}
