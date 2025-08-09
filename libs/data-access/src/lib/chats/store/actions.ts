import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Chat,
  ChatLoadedResponse,
  ChatsListItem,
  ChatWSMessage,
} from '../interfaces';

export const chatsActions = createActionGroup({
  source: 'chats',
  events: {
    'get chat by id': props<{ chatId: number }>(),
    'chat loaded': props<ChatLoadedResponse>(),

    'get my chats': emptyProps(),
    'chats loaded': props<{ chats: ChatsListItem[] }>(),

    'filter chats': props<{ value: string | null }>(),

    'create chat': props<{ userId: number }>(),
    'chat created': props<{ chat: Chat }>(),

    'new message': props<{ message: ChatWSMessage }>(),
  },
});
