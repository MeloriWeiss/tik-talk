import {Component, computed, HostBinding, inject, input, Renderer2} from '@angular/core';
import {AvatarCircleComponent} from "../../../common-ui/avatar-circle/avatar-circle.component";
import {ProfileService} from "../../../data/services/profile.service";
import {SvgIconComponent} from "../../../common-ui/svg-icon/svg-icon.component";
import {PostService} from "../../../data/services/post.service";
import {FormsModule} from "@angular/forms";
import {firstValueFrom} from "rxjs";
import {MainTextareaComponent} from "../../../common-ui/main-textarea/main-textarea.component";

@Component({
  selector: 'app-post-input',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    SvgIconComponent,
    FormsModule,
    MainTextareaComponent
  ],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss'
})
export class PostInputComponent {
  postService = inject(PostService);

  isCommentInput = input(false);
  postId = input(0);
  placeholder;

  isEmojiOpened = false;

  @HostBinding('class.border-dashed')
  get isComment() {
    return this.isCommentInput();
  }

  constructor() {
    this.placeholder = computed(() => {
      return `Напишите ${this.isCommentInput()
        ? 'комментарий' : 'что-нибудь'}`
    });
  }

  profile = inject(ProfileService).me;

  postText = '';

  onTextareaInput(value: string) {
    this.postText = value;
  }

  onCreatePost() {
    if (!this.postText) {
      return;
    }

    if (this.isCommentInput()) {
      firstValueFrom(this.postService.createComment({
        text: this.postText,
        authorId: this.profile()!.id,
        postId: this.postId()
      })).then(() => {
        this.postText = '';
      });
      return;
    }

    firstValueFrom(this.postService.createPost({
      title: 'Клёвый пост',
      content: this.postText,
      authorId: this.profile()!.id
    })).then(() => {
      this.postText = '';
    });
  }

  onOpenEmojiList() {
    this.isEmojiOpened = !this.isEmojiOpened;
  }

  onClickSmile(event: Event) {
    const smile = (event.target as HTMLElement).innerHTML;
    if (smile.length !== 2) {
      return;
    }
    this.postText += smile;
    this.isEmojiOpened = false;
  }
}
