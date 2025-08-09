import {
  AfterViewInit, ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input, OnDestroy,
  signal,
  ViewChild
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ChatMessagesGroupComponent } from './chat-messages-group/chat-messages-group.component';
import { ScrollBlockDirective } from '@tt/common-ui';
import { MessageInputComponent } from '@tt/shared';
import { ChatsService, PatchedChat, selectActiveChatMessages } from '@tt/data-access/chats';
import { Subscription, tap } from 'rxjs';
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

  chat = input.required<PatchedChat>();
  messagesGroups = this.store.selectSignal(selectActiveChatMessages);
  currentMessagesGroupDate = signal<string>('');

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  scrollContainerSub: Subscription | null = null;

  constructor() {
    toObservable(this.chat)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
        this.currentMessagesGroupDate.set(
          this.messagesGroups()[this.messagesGroups().length - 1]?.date
        );
      });
  }

  onChangeGroupDate(date: string) {
    this.currentMessagesGroupDate.set(date);
  }

  async onSendMessage(messageText: string) {
    this.chatsService.wsAdaptor.sendMessage(messageText, this.chat().id);
  }

  ngAfterViewInit() {
    this.scrollContainerSub = this.chatsService.messages$
      .pipe(
        tap(() => {
          requestAnimationFrame(() => {
            this.messagesContainer.nativeElement.scrollTop =
              this.messagesContainer.nativeElement.scrollHeight;
          });
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.scrollContainerSub?.unsubscribe();
  }
}
