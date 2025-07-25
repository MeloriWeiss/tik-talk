import {Component, EventEmitter, inject, input, Output} from '@angular/core';
import {AvatarCircleComponent} from "../avatar-circle/avatar-circle.component";
import {ProfileService} from "../../data/services/profile.service";
import {SvgIconComponent} from "../svg-icon/svg-icon.component";
import {FormsModule} from "@angular/forms";
import {MainTextareaComponent} from "../main-textarea/main-textarea.component";

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    SvgIconComponent,
    FormsModule,
    MainTextareaComponent,
  ],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss'
})
export class MessageInputComponent {
  profile = inject(ProfileService).me;

  placeholder = input('');

  isEmojiOpened = false;
  text = '';

  @Output() created = new EventEmitter<string>();

  onTextareaInput(value: string) {
    this.text = value;
  }

  onCreate() {
    if (!this.text) {
      return;
    }
    this.created.emit(this.text.trim());
    this.text = '';
  }

  onOpenEmojiList() {
    this.isEmojiOpened = !this.isEmojiOpened;
  }

  onClickSmile(event: Event) {
    const smile = (event.target as HTMLElement).innerHTML;
    if (smile.length !== 2) {
      return;
    }
    this.text += smile;
    this.isEmojiOpened = false;
  }
}
