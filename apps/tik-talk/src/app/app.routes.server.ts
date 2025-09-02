import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
  {
    path: 'settings',
    renderMode: RenderMode.Client,
  },
  {
    path: 'profile/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'search',
    renderMode: RenderMode.Client,
  },
  {
    path: 'chats',
    renderMode: RenderMode.Client,
  },
  {
    path: 'chats/:id',
    renderMode: RenderMode.Client,
  },
];
