import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { MessagesGroup } from '@tt/data-access/chats';

@Component({
  selector: 'app-chat-messages-group',
  standalone: true,
  imports: [ChatMessageComponent],
  templateUrl: './chat-messages-group.component.html',
  styleUrl: './chat-messages-group.component.scss',
})
export class ChatMessagesGroupComponent implements AfterViewInit, OnDestroy {
  messageGroup = input<MessagesGroup>();

  @ViewChild('dateGroupTitle') dateGroupTitle!: ElementRef;

  @Output() dateChanged = new EventEmitter<string>();

  observer!: IntersectionObserver;

  ngAfterViewInit() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.dateChanged.emit(entry.target.innerHTML);
        }
      });
    });
    this.observer.observe(this.dateGroupTitle.nativeElement);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
