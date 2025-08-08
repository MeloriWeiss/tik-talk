import { ChatConnectionWSParams, ChatWSService } from '../interfaces';

export class ChatWSNativeService implements ChatWSService {
  #socket: WebSocket | null = null;

  connect(params: ChatConnectionWSParams) {
    if (this.#socket) {
      return;
    }

    this.#socket = new WebSocket(params.url, [params.token]);

    this.#socket.onmessage = (event: MessageEvent) => {
      params.handleWSMessage(JSON.parse(event.data));
    };

    this.#socket.onclose = () => {
      console.log('Кино уже кончилось');
    };
  }

  disconnect() {
    this.#socket?.close();
  }

  sendMessage(text: string, chatId: number) {
    this.#socket?.send(
      JSON.stringify({
        text,
        chat_id: chatId,
      })
    );
  }
}
