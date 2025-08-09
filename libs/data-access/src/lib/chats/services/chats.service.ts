import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { DateUtil } from '@tt/common-ui';
import { httpConfig } from '../../shared/index';
import { Store } from '@ngrx/store';
import { selectMe } from '../../profile';
import {
  ChatWSService,
  ChatWSMessage,
  Chat,
  ChatsListItem,
  MessagesGroup,
  PatchedChat,
  ChatLoadedResponse,
} from '../interfaces';
import { AuthService } from '../../auth/index';
import { ChatWSRxjsService } from './chat-ws-rxjs.service';
import { chatsActions } from '../store';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  http = inject(HttpClient);
  authService = inject(AuthService);
  store = inject(Store);
  me = inject(Store).selectSignal(selectMe);

  wsAdaptor: ChatWSService = new ChatWSRxjsService();
  messages$ = new BehaviorSubject<null>(null);
  baseApiUrl = httpConfig.baseApiUrl;

  connectWs() {
    return this.wsAdaptor.connect({
      url: `${this.baseApiUrl}chat/ws`,
      token: this.authService.accessToken ?? '',
      handleWSMessage: this.handleWSMessage,
    }) as Observable<ChatWSMessage>;
  }

  handleWSMessage = (message: ChatWSMessage) => {
    this.store.dispatch(chatsActions.newMessage({ message }));
    this.messages$.next(null);
  };

  createChat(userId: number) {
    return this.http.post<Chat>(`${this.baseApiUrl}chat/${userId}`, {});
  }

  getMyChats() {
    return this.http
      .get<ChatsListItem[]>(`${this.baseApiUrl}chat/get_my_chats/`)
      .pipe(
        map((chat) => {
          return chat.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        })
      );
  }

  getChatById(chatId: number): Observable<ChatLoadedResponse> {
    const formattedToday = DateUtil.getFormattedToday();

    return this.http.get<Chat>(`${this.baseApiUrl}chat/${chatId}`).pipe(
      map((chat) => {
        const messagesGroups: MessagesGroup[] = [];

        chat.messages.forEach((message) => {
          let formattedDate = DateUtil.getFormattedDate(message.createdAt);
          formattedDate =
            formattedToday === formattedDate ? 'Сегодня' : formattedDate;

          const existingMessageGroup = messagesGroups.find(
            (group) => group.date === formattedDate
          );

          const newMessage = {
            ...message,
            user:
              chat.userFirst.id === message.userFromId
                ? chat.userFirst
                : chat.userSecond,
            isMine: message.userFromId === this.me()?.id,
          };

          if (existingMessageGroup) {
            existingMessageGroup.messages.push(newMessage);
            return;
          }

          messagesGroups.push({
            date: formattedDate,
            messages: [newMessage],
          });
        });

        const newActiveChat = {
          ...chat,
          companion:
            chat.userFirst.id === this.me()?.id
              ? chat.userSecond
              : chat.userFirst,
          messages: messagesGroups,
        };

        return {
          activeChat: newActiveChat,
          activeChatMessages: messagesGroups,
        };
      })
    );
  }
}
