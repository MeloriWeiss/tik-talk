import {
  Component,
  ElementRef,
  inject,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ChatMessagesGroupComponent } from './chat-messages-group/chat-messages-group.component';
import { ScrollBlockDirective } from '@tt/common-ui';
import { MessageInputComponent } from '@tt/shared';
import { ChatsService, PatchedChat } from '@tt/data-access/chats';

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
})
export class ChatMessagesWrapperComponent {
  chatsService = inject(ChatsService);

  chat = input.required<PatchedChat>();
  messagesGroups = this.chatsService.activeChatMessages;
  currentMessagesGroupDate = signal<string>('');

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

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
    await firstValueFrom(
      this.chatsService.sendMessage(this.chat().id, messageText)
    );
    await firstValueFrom(this.chatsService.getChatById(this.chat().id));

    requestAnimationFrame(() => {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    });
  }
}
