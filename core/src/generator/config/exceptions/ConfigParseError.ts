import { BadRequestException } from '@nestjs/common';

export class ConfigParseError extends BadRequestException {
  constructor() {
    super(
      'Invalid config provided, please check the config file. (.roci-reviewapp.config.json)',
    );
  }
}
