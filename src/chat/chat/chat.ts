import { Injectable, Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface MessageDto {
  room: string;
  nickname: string;
  message: string;
}

@WebSocketGateway(4020, { transports: ['websocket', 'polling'], cors: { origin: '*' } })
export class Chat {

  @WebSocketServer()
  server: Server;
  logger = new Logger();

  @SubscribeMessage('join')
  handlerJoin(
    @MessageBody() room: string,
    @ConnectedSocket() socket: Socket
  ): void {
    this.logger.warn(`Join Room: ${room}`);
    socket.join(room);
  }

  @SubscribeMessage('send')
  hanlerSend(
    @MessageBody() messageDto : MessageDto
  ): void {
    const { room, message, nickname } = messageDto;
    this.logger.verbose(message);
    this.server.to(room).emit('get', {nickname, message});
  }

}
