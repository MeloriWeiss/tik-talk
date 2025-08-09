import {
  ChatsListItem,
  isNewMessage,
  isUnreadMessage,
  Message,
  MessagesGroup,
  PatchedChat,
} from '../interfaces';
import { createFeature, createReducer, on } from '@ngrx/store';
import { chatsActions } from './actions';
import { DateUtil } from '@tt/common-ui';

export interface ChatsState {
  activeChat: PatchedChat | null;
  activeChatMessages: MessagesGroup[];
  unreadMessagesCount: number;
  chats: ChatsListItem[];
}

export const initialState: ChatsState = {
  activeChat: null,
  activeChatMessages: [],
  unreadMessagesCount: 0,
  chats: [],
};

export const chatsFeature = createFeature({
  name: 'chatsFeature',
  reducer: createReducer(
    initialState,
    on(chatsActions.chatLoaded, (state, { activeChat, activeChatMessages }) => {
      return {
        ...state,
        activeChat,
        activeChatMessages,
      };
    }),
    on(chatsActions.chatsLoaded, (state, { chats }) => {
      return {
        ...state,
        chats,
      };
    }),
    on(chatsActions.filterChats, (state, { value }) => {
      return {
        ...state,
        chats: state.chats.filter((chat) => {
          return `${chat.userFrom.firstName} ${chat.userFrom.lastName}`
            .toLowerCase()
            .includes(value?.toLowerCase() ?? '');
        }),
      };
    }),
    on(chatsActions.newMessage, (state, { message }) => {
      if (!('action' in message)) {
        return state;
      }

      if (isUnreadMessage(message)) {
        return {
          ...state,
          unreadMessagesCount: message.data.count,
        };
      }

      if (isNewMessage(message)) {
        const messagesGroupsBase = [...state.activeChatMessages];
        const messagesGroups = messagesGroupsBase.map((group) => {
          return {
            ...group,
            messages: [...group.messages],
          };
        });

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
          isMine: message.data.author !== state.activeChat?.companion?.id,
          user:
            state.activeChat?.userFirst.id === message.data.author
              ? state.activeChat?.userFirst
              : state.activeChat?.userSecond,
        };

        if (existingMessageGroup) {
          existingMessageGroup.messages.push(newMessage);
        } else {
          messagesGroups.push({
            date: formattedDate,
            messages: [newMessage],
          });
        }

        return {
          ...state,
          activeChatMessages: messagesGroups,
        };
      }

      return state;
    })
  ),
});
