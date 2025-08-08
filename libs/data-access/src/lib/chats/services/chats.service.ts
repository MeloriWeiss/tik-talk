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
  Message,
  MessagesGroup,
  PatchedChat,
  isNewMessage,
  isUnreadMessage,
} from '../interfaces';
import { AuthService } from '../../auth/index';
import { ChatWSRxjsService } from './chat-ws-rxjs.service';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  http = inject(HttpClient);
  authService = inject(AuthService);
  me = inject(Store).selectSignal(selectMe);

  activeChat = signal<PatchedChat | null>(null);
  activeChatMessages = signal<MessagesGroup[]>([]);
  unreadMessagesCount = signal(0);

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
    if (!('action' in message)) {
      return;
    }

    if (isUnreadMessage(message)) {
      this.unreadMessagesCount.set(message.data.count);
    }

    if (isNewMessage(message)) {
      const messagesGroups = this.activeChatMessages();

      const formattedToday = DateUtil.getFormattedToday();
      let formattedDate = DateUtil.getFormattedDate(message.data.created_at);

      formattedDate =
        formattedToday === formattedDate ? 'Сегодня' : formattedDate;

      const existingMessageGroup = messagesGroups.find(
        (group) => group.date === formattedDate
      );

      const newMessage: Message = {
        id: message.data.id,
        userFromId: message.data.author,
        personalChatId: message.data.chat_id,
        text: message.data.message,
        createdAt: message.data.created_at,
        isRead: false,
        isMine: message.data.author === this.me()?.id,
        user:
          this.activeChat()?.userFirst.id === message.data.author
            ? this.activeChat()?.userFirst
            : this.activeChat()?.userSecond,
      };

      if (existingMessageGroup) {
        existingMessageGroup.messages.push(newMessage);
      } else {
        messagesGroups.push({
          date: formattedDate,
          messages: [newMessage],
        });
      }

      this.activeChatMessages.set(messagesGroups);
    }
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

  getChatById(chatId: number): Observable<PatchedChat> {
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

        this.activeChatMessages.set(messagesGroups);

        const newActiveChat = {
          ...chat,
          companion:
            chat.userFirst.id === this.me()?.id
              ? chat.userSecond
              : chat.userFirst,
          messages: messagesGroups,
        };

        this.activeChat.set(newActiveChat);

        return newActiveChat;
      })
    );
  }
}
