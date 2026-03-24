import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { EventsServer } from './interfaces/eventsServer';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      console.log(error);
      client.disconnect();
      return;
    }

    //! emite notificaciones al cliente
    this.wss.emit(
      EventsServer.updateClient,
      this.messagesWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client);
    //! emite notificaciones al cliente
    this.wss.emit(
      EventsServer.updateClient,
      this.messagesWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage(EventsServer.messageFromClient)
  handkeMessageFromClient(client: Socket, payload: NewMessageDto) {
    //! Emite unicamente al cliente que envio
    // client.emit(EventsServer.messageFromClient, {
    //   fullName: 'YO!',
    //   message: payload.message,
    // });

    //! Emite a todos menos al cliente inicial
    // client.broadcast.emit(EventsServer.messageFromClient, {
    //   fullName: 'YO!',
    //   message: payload.message,
    // });

    //! Emite a todos
    this.wss.emit(EventsServer.messageFromClient, {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message,
    });
  }
}
