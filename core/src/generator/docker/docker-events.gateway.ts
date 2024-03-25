import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'node:net';

@WebSocketGateway(4002, {
  cors: {
    origin: '*',
  },
})
export class DockerEventsGateway {
  @WebSocketServer()
  server: Server;

  sendEvent(data: string, topicName: string) {
    this.server.emit(topicName, data);
  }
}
