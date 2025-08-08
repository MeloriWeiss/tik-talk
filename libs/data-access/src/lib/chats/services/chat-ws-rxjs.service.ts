import {
  ChatWSService,
  ChatWSMessage,
  ChatConnectionWSParams,
} from '../interfaces';
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { finalize, Observable, tap } from 'rxjs';

export class ChatWSRxjsService implements ChatWSService {
  #socket: WebSocketSubject<ChatWSMessage> | null = null;

  connect(params: ChatConnectionWSParams): Observable<ChatWSMessage> {
    if (!this.#socket) {
      this.#socket = new WebSocketSubject({
        url: params.url,
        protocol: [params.token]
      });
    }

    return this.#socket.asObservable()
      .pipe(
        tap(message => {
          params.handleWSMessage(message);
        }),
        finalize(() => console.log('Кино уже кончилось'))
      );
  };

  disconnect() {
    this.#socket?.complete();
  }

  sendMessage(text: string, chatId: number) {
    this.#socket?.next({
      text,
      chat_id: chatId
    })
  }
}
