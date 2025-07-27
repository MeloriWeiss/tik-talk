import { Component, inject } from '@angular/core';
import { PostComponent } from '../post/post.component';
import { firstValueFrom } from 'rxjs';
import { PostService } from '@tt/data-access/posts';
import { MessageInputComponent } from '@tt/shared';
import { GlobalStoreService } from '@tt/data-access/shared';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [
    PostComponent,
    MessageInputComponent
  ],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent {
  postService = inject(PostService);
  feed = this.postService.posts;
  profile = inject(GlobalStoreService).me;

  constructor() {
    firstValueFrom(this.postService.fetchPosts()).then();
  }

  onCreatePost(text: string) {
    firstValueFrom(
      this.postService.createPost({
        title: 'Клёвый пост',
        content: text,
        authorId: this.profile()!.id,
      })
    ).then();
  }
}
