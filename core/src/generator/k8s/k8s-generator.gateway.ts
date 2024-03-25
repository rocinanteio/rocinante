import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'node:net';

@WebSocketGateway(4002, {
  cors: {
    origin: '*',
  },
})
export class K8sGeneratorGateway {
  @WebSocketServer()
  server: Server;

  sendEvent(topic: string, data: string) {
    this.server.emit(topic, data);
  }
}
