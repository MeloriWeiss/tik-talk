import {Component, inject, signal} from '@angular/core';
import {ProfileHeaderComponent} from "../../common-ui/profile-header/profile-header.component";
import {ProfileService} from "../../data/services/profile.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {firstValueFrom, switchMap} from "rxjs";
import {toObservable} from "@angular/core/rxjs-interop";
import {AsyncPipe} from "@angular/common";
import {SvgIconComponent} from "../../common-ui/svg-icon/svg-icon.component";
import {ImgUrlPipe} from "../../helpers/pipes/img-url.pipe";
import {PostFeedComponent} from "./post-feed/post-feed.component";
import {ChatsService} from "../../data/services/chats.service";
import {ScrollBlockDirective} from "../../common-ui/directives/scroll-block.directive";

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    AsyncPipe,
    SvgIconComponent,
    RouterLink,
    ImgUrlPipe,
    PostFeedComponent,
    ScrollBlockDirective
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
  profileService = inject(ProfileService);
  chatsService = inject(ChatsService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  me$ = toObservable(this.profileService.me);
  subscribers$ = this.profileService.getSubscribersShortList(6);

  isMyPage = signal(false);

  profile$ = this.route.params
    .pipe(
      switchMap(({id}) => {
        this.isMyPage.set(id === 'me' || id === this.profileService.me()!.id);

        if (this.isMyPage()) {
          return this.me$;
        }
        return this.profileService.getAccount(id);
      })
    );

  async sendMessage(userId: number) {
    firstValueFrom(this.chatsService.createChat(userId))
      .then(res => {
        this.router.navigate(['/chats', res.id])
      });
  }
}
