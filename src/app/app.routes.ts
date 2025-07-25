import {Routes} from '@angular/router';
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {SearchPageComponent} from "./pages/search-page/search-page.component";
import {ProfilePageComponent} from "./pages/profile-page/profile-page.component";
import {LayoutComponent} from "./common-ui/layout/layout.component";
import {canActivateAuth} from "./auth/access.guard";
import {SettingsPageComponent} from "./pages/settings-page/settings-page.component";
import {chatsRoutes} from "./pages/chats-page/chats-routes";
import {ExpRFormsComponent} from "./experimental/exp-r-forms/exp-r-forms.component";
import {ExpTdFormsComponent} from "./experimental/exp-td-forms/exp-td-forms.component";
import {ExpMyFormComponent} from "./experimental/exp-my-form/exp-my-form.component";

export const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      {path: '', redirectTo: 'profile/me', pathMatch: 'full'},
      {path: 'profile/:id', component: ProfilePageComponent},
      {path: 'settings', component: SettingsPageComponent},
      {path: 'search', component: SearchPageComponent},
      {
        path: 'chats',
        loadChildren: () => chatsRoutes
      },
    ],
    canActivate: [canActivateAuth]
  },
  {path: 'login', component: LoginPageComponent},


  {
    path: 'exp',
    children: [
      {path: 'td', component: ExpTdFormsComponent},
      {path: 'r', component: ExpRFormsComponent},
      {path: 'my', component: ExpMyFormComponent},
    ]
  }
];
