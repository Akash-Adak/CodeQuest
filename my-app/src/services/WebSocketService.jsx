import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.roomId = null;
    this.token = null;
  }

  connect(roomId, token, codeCallback, chatCallback) {
    this.roomId = roomId;
    this.token = token;

    const socket = new SockJS("http://localhost:8080/ws");

    this.stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: this.token ? { Authorization: 'Bearer ' + this.token } : {},
      debug: function (str) {
        console.log(str);
      },
      onConnect: () => {
        console.log("Connected to WebSocket");

        this.stompClient.subscribe(`/topic/room/${this.roomId}`, (message) => {
          try {
            const parsedBody = JSON.parse(message.body);
            codeCallback(parsedBody.content);
          } catch (error) {
            console.error("Failed to parse WebSocket message", error);
            codeCallback(message.body);
          }
          console.log("Received message: ", message.body);
        });

        this.stompClient.subscribe(`/topic/room/${this.roomId}/chat`, (message) => {
          try {
            const parsedBody = JSON.parse(message.body);
            chatCallback(parsedBody);
          } catch (error) {
            console.error("Failed to parse chat message", error);
          }
        });

        console.log(`Subscribed to /topic/room/${this.roomId} and chat`);
      },
      onStompError: (frame) => {
        console.error("STOMP error: ", frame);
      },
    });

    this.stompClient.activate();
  }

  sendCodeMessage(message) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: `/app/code/${this.roomId}`,
        body: JSON.stringify({ roomId: this.roomId, content: message }),
      });
    }
  }

  sendChatMessage(participant, message) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: `/app/room/${this.roomId}/chat`,
        body: JSON.stringify({ roomId: this.roomId, participant, message }),
      });
    }
  }

  sendMessage(message, destination = `/app/code/${this.roomId}`) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: destination,
        body: typeof message === 'string' ? message : JSON.stringify(message),
      });
    }
  }

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.deactivate();
    }
  }
}

export default new WebSocketService();
