import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Chat, ChatsListItem, Message, MessagesGroup} from "../interfaces/chats.interface";
import {ProfileService} from "./profile.service";
import {map} from "rxjs";
import {DateTime} from "luxon";
import {DateUtil} from "../../helpers/utils/date.util";

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  http = inject(HttpClient);
  me = inject(ProfileService).me;

  activeChatMessages = signal<MessagesGroup[]>([]);

  createChat(userId: number) {
    return this.http.post<Chat>(`${environment.baseApiUrl}chat/${userId}`, {});
  }

  getMyChats() {
    return this.http.get<ChatsListItem[]>(`${environment.baseApiUrl}chat/get_my_chats/`);
  }

  getChatById(chatId: number) {
    const today = DateTime.local();
    const formattedToday = DateUtil.createCorrectDateString('.', today.day, today.month, today.year);

    return this.http.get<Chat>(`${environment.baseApiUrl}chat/${chatId}`)
      .pipe(
        map(chat => {
          const messageGroups: MessagesGroup[] = [];

          chat.messages.forEach(message => {
            const dateTime = DateTime.fromISO(message.createdAt);
            let formattedDate = DateUtil.createCorrectDateString('.', dateTime.day, dateTime.month, dateTime.year);
            formattedDate = formattedToday === formattedDate ? 'Сегодня' : formattedDate;

            const existingMessageGroup = messageGroups.find(group => group.date === formattedDate);

            if (existingMessageGroup) {
              existingMessageGroup.messages.push({
                ...message,
                user: chat.userFirst.id === message.userFromId ? chat.userFirst : chat.userSecond,
                isMine: message.userFromId === this.me()?.id
              });
              return;
            }

            messageGroups.push({
              date: formattedDate,
              messages: [{
                ...message,
                user: chat.userFirst.id === message.userFromId ? chat.userFirst : chat.userSecond,
                isMine: message.userFromId === this.me()?.id
              }]
            });
          });

          this.activeChatMessages.set(messageGroups);

          return {
            ...chat,
            companion: chat.userFirst.id === this.me()?.id ? chat.userSecond : chat.userFirst,
            messages: messageGroups
          }
        })
      );
  }

  sendMessage(chatId: number, message: string) {
    return this.http.post<Message>(`${environment.baseApiUrl}message/send/${chatId}`, {}, {
      params: {message}
    });
  }
}
