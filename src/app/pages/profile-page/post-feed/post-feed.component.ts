import {Component, inject} from '@angular/core';
import {PostComponent} from "../post/post.component";
import {PostService} from "../../../data/services/post.service";
import {firstValueFrom} from "rxjs";
import {ProfileService} from "../../../data/services/profile.service";
import {MessageInputComponent} from "../../../common-ui/message-input/message-input.component";

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [
    PostComponent,
    MessageInputComponent
  ],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent {
  postService = inject(PostService);
  feed = this.postService.posts;
  profile = inject(ProfileService).me;

  constructor() {
    firstValueFrom(this.postService.fetchPosts()).then();
  }

  onCreatePost(text: string) {
    firstValueFrom(this.postService.createPost({
        title: 'Клёвый пост',
        content: text,
        authorId: this.profile()!.id
      })).then();
  }
}
