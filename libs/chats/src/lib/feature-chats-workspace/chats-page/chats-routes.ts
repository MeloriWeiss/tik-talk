import { Routes } from '@angular/router';
import { ChatsPageComponent } from './chats-page.component';
import { ChatWorkspaceComponent } from '../chat-workspace/chat-workspace.component';

export const chatsRoutes: Routes = [
  {
    path: '',
    component: ChatsPageComponent,
    children: [{ path: ':id', component: ChatWorkspaceComponent }],
  },
];
