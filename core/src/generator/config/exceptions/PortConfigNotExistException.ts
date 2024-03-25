import { BadRequestException } from '@nestjs/common';

export class PortConfigNotExistException extends BadRequestException {
  constructor() {
    super('You should provide an application node port in config file');
  }
}
