import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  input,
  output,
  Output
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarCircleComponent, MainTextareaComponent, SvgIconComponent } from '@tt/common-ui';
import { Store } from '@ngrx/store';
import { selectMe } from '@tt/data-access/profile';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    SvgIconComponent,
    FormsModule,
    MainTextareaComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageInputComponent {
  store = inject(Store);
  cdr = inject(ChangeDetectorRef);

  profile = this.store.selectSignal(selectMe);

  placeholder = input('');

  isEmojiOpened = false;
  textareaControl = new FormControl('');

  created = output<string>();

  onCreate() {
    if (!this.textareaControl.value) {
      return;
    }
    this.created.emit(this.textareaControl.value.trim());
    this.textareaControl.setValue('');
  }

  onOpenEmojiList() {
    this.isEmojiOpened = !this.isEmojiOpened;
  }

  onClickSmile(event: Event) {
    const smile = (event.target as HTMLElement).innerHTML;
    if (smile.length !== 2) {
      return;
    }
    this.textareaControl.patchValue(this.textareaControl.value + smile);
    this.isEmojiOpened = false;
  }
}
