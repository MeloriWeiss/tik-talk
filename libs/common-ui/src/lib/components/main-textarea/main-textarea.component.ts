import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  input,
  Input,
  Output,
  Renderer2
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main-textarea',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './main-textarea.component.html',
  styleUrl: './main-textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainTextareaComponent {
  r2 = inject(Renderer2);

  @Input() text = '';
  placeholder = input('Напишите что-нибудь');
  rows = input('1');

  @Output() inputText = new EventEmitter<string>();

  onTextareaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');

    this.inputText.emit(this.text);
  }
}
