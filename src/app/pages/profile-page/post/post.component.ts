import {Component, inject, input, OnInit, signal} from '@angular/core';
import {PostComment, Post} from "../../../data/interfaces/post.interface";
import {AvatarCircleComponent} from "../../../common-ui/avatar-circle/avatar-circle.component";
import {SvgIconComponent} from "../../../common-ui/svg-icon/svg-icon.component";
import {CommentComponent} from "./comment/comment.component";
import {PostService} from "../../../data/services/post.service";
import {firstValueFrom} from "rxjs";
import {ProfileService} from "../../../data/services/profile.service";
import {DateDiffPipe} from "../../../helpers/pipes/date-diff.pipe";
import {MessageInputComponent} from "../../../common-ui/message-input/message-input.component";

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    SvgIconComponent,
    CommentComponent,
    DateDiffPipe,
    MessageInputComponent
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  postService = inject(PostService);

  post = input<Post>();
  comments = signal<PostComment[]>([]);
  profile = inject(ProfileService).me;

  ngOnInit() {
    this.comments.set(this.post()!.comments);
  }

  async onCreatedComment(text: string) {
    await firstValueFrom(this.postService.createComment({
      text: text,
      authorId: this.profile()!.id,
      postId: this.post()!.id
    }));

    const comments = await firstValueFrom(this.postService.getCommentsByPostId(this.post()!.id));
    this.comments.set(comments);
  }
}
