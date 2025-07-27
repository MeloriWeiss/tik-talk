import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarCircleComponent, MainTextareaComponent, SvgIconComponent } from '@tt/common-ui';
import { GlobalStoreService } from '@tt/data-access/shared';

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
  styleUrl: './message-input.component.scss',
})
export class MessageInputComponent {
  profile = inject(GlobalStoreService).me;

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
