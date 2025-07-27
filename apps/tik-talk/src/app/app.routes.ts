import { Routes } from '@angular/router';
import { canActivateAuth, LoginPageComponent } from '@tt/auth';
import { ExpRFormsComponent } from './experimental/exp-r-forms/exp-r-forms.component';
import { ExpTdFormsComponent } from './experimental/exp-td-forms/exp-td-forms.component';
import { ExpMyFormComponent } from './experimental/exp-my-form/exp-my-form.component';
import { ProfilePageComponent, SearchPageComponent, SettingsPageComponent } from '@tt/profile';
import { chatsRoutes } from '@tt/chats';
import { LayoutComponent } from '@tt/layout';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      { path: 'profile/:id', component: ProfilePageComponent },
      { path: 'settings', component: SettingsPageComponent },
      { path: 'search', component: SearchPageComponent },
      {
        path: 'chats',
        loadChildren: () => chatsRoutes,
      },
    ],
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
