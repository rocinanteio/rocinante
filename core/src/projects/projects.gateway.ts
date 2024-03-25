import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'node:net';

@WebSocketGateway(4002, {
  cors: {
    origin: '*',
  },
})
export class ProjectsGateway implements OnGatewayConnection {
  private logger: Logger = new Logger('AppGateway');

  @WebSocketServer()
  server: Server;

  sendEvent(topic: string, data: string) {
    this.server.emit(topic, data);
  }

  handleConnection() {
    this.logger.log('Project Gateway client connected');
  }
}
