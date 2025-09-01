import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { MessagesGroup } from '@tt/data-access/chats';

@Component({
  selector: 'app-chat-messages-group',
  standalone: true,
  imports: [ChatMessageComponent],
  templateUrl: './chat-messages-group.component.html',
  styleUrl: './chat-messages-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMessagesGroupComponent implements AfterViewInit, OnDestroy {
  messageGroup = input.required<MessagesGroup>();
  observer = input.required<IntersectionObserver | null>();

  dateGroupTitle = viewChild.required<ElementRef>('dateGroupTitle');

  ngAfterViewInit() {
    this.observer()?.observe(this.dateGroupTitle().nativeElement);
  }

  ngOnDestroy() {
    this.observer()?.unobserve(this.dateGroupTitle().nativeElement);
  }
}
