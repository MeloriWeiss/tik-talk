import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommentComponent } from '../../ui';
import { firstValueFrom } from 'rxjs';
import { AvatarCircleComponent, DateDiffPipe, SvgIconComponent } from '@tt/common-ui';
import { Post, PostComment, PostService } from '../../data';
import {
  MessageInputComponent
} from '../../../../../shared/src/lib/components';
import { GlobalStoreService } from '@tt/shared';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    SvgIconComponent,
    CommentComponent,
    DateDiffPipe,
    MessageInputComponent,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
  postService = inject(PostService);

  post = input<Post>();
  comments = signal<PostComment[]>([]);
  profile = inject(GlobalStoreService).me;

  ngOnInit() {
    this.comments.set(this.post()!.comments);
  }

  async onCreatedComment(text: string) {
    await firstValueFrom(
      this.postService.createComment({
        text: text,
        authorId: this.profile()!.id,
        postId: this.post()!.id,
      })
    );

    const comments = await firstValueFrom(
      this.postService.getCommentsByPostId(this.post()!.id)
    );
    this.comments.set(comments);
  }
}
