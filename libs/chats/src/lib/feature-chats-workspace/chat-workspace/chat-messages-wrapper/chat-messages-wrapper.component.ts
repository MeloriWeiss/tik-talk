import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ChatMessagesGroupComponent } from './chat-messages-group/chat-messages-group.component';
import { ScrollBlockDirective } from '@tt/common-ui';
import { MessageInputComponent } from '@tt/shared';
import {
  ChatsService,
  PatchedChat,
  selectActiveChatMessages,
} from '@tt/data-access/chats';
import { tap } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-chat-messages-wrapper',
  standalone: true,
  imports: [
    MessageInputComponent,
    ScrollBlockDirective,
    ChatMessagesGroupComponent,
  ],
  templateUrl: './chat-messages-wrapper.component.html',
  styleUrl: './chat-messages-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatMessagesWrapperComponent implements AfterViewInit, OnDestroy {
  chatsService = inject(ChatsService);
  store = inject(Store);
  destroyRef = inject(DestroyRef);

  chat = input.required<PatchedChat>();

  messagesContainer = viewChild.required<ElementRef>('messagesContainer');

  messagesGroups = this.store.selectSignal(selectActiveChatMessages);
  currentMessagesGroupDate = signal<string>('');

  observer: IntersectionObserver | null = null;

  constructor() {
    toObservable(this.chat)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.scrollMessagesContainer();
        const messagesGroups = this.messagesGroups();
        this.currentMessagesGroupDate.set(
          messagesGroups[messagesGroups.length - 1]?.date
        );
      });

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.currentMessagesGroupDate.set(entry.target.innerHTML);
        }
      });
    });
  }

  async onSendMessage(messageText: string) {
    this.chatsService.wsAdaptor.sendMessage(messageText, this.chat().id);
  }

  ngAfterViewInit() {
    this.chatsService.messages$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          requestAnimationFrame(() => {
            this.scrollMessagesContainer();
          });
        })
      )
      .subscribe();
  }

  scrollMessagesContainer() {
    const messagesContainer = this.messagesContainer();
    messagesContainer.nativeElement.scrollTop =
      messagesContainer.nativeElement.scrollHeight;
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
