import { Routes } from '@angular/router';
import { canActivateAuth, LoginPageComponent } from '@tt/auth';
import { ExpRFormsComponent } from '@tt/experimental';
import { ExpTdFormsComponent } from '@tt/experimental';
import { ExpMyFormComponent } from '@tt/experimental';
import {
  ProfilePageComponent,
  SearchPageComponent,
  SettingsPageComponent,
} from '@tt/profile';
import { chatsRoutes } from '@tt/chats';
import { LayoutComponent } from '@tt/layout';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { ProfileEffects, profileFeature } from '@tt/data-access/profile';
import { PostsEffects, postsFeature } from '@tt/data-access/posts';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      {
        path: 'profile/:id',
        component: ProfilePageComponent,
        providers: [provideState(postsFeature), provideEffects(PostsEffects)],
      },
      { path: 'settings', component: SettingsPageComponent },
      { path: 'search', component: SearchPageComponent },
      {
        path: 'chats',
        loadChildren: () => chatsRoutes,
      },
    ],
    providers: [provideState(profileFeature), provideEffects(ProfileEffects)],
    canActivate: [canActivateAuth],
  },
  { path: 'login', component: LoginPageComponent },

  {
    path: 'exp',
    children: [
      { path: 'td', component: ExpTdFormsComponent },
      { path: 'r', component: ExpRFormsComponent },
      { path: 'my', component: ExpMyFormComponent },
    ],
  },
];
