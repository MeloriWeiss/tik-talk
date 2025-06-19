import {Component, inject, OnInit} from '@angular/core';
import {SvgIconComponent} from "../svg-icon/svg-icon.component";
import {SubscriberCardComponent} from "../subscriber-card/subscriber-card.component";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {ProfileService} from "../../data/services/profile.service";
import {AsyncPipe} from "@angular/common";
import {firstValueFrom} from "rxjs";
import {ImgUrlPipe} from "../../helpers/pipes/img-url.pipe";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SubscriberCardComponent,
    RouterLink,
    SvgIconComponent,
    AsyncPipe,
    ImgUrlPipe,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  profileService = inject(ProfileService);

  subscribers$ = this.profileService.getSubscribersShortList(3);
  me = this.profileService.me;

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me'
    },
    {
      label: 'Чаты',
      icon: 'chats',
      link: 'chats'
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search'
    },
  ];

  ngOnInit() {
    firstValueFrom(this.profileService.getMe()).then();
  }
}
