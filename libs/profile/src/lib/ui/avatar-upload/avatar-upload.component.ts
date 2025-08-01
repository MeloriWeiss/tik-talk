import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { DndDirective, SvgIconComponent } from '@tt/common-ui';
import { httpConfig } from '@tt/data-access/shared';
import { ProfileService } from '@tt/data-access/profile';

@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [SvgIconComponent, DndDirective, FormsModule],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss',
})
export class AvatarUploadComponent {
  profileService = inject(ProfileService);

  avatar: File | null = null;
  baseApiUrl = httpConfig.baseApiUrl;

  me = this.profileService.me;
  preview = signal<string>('/assets/svg/avatar-placeholder.svg');

  constructor() {
    toObservable(this.me)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.preview.set(this.baseApiUrl + this.me()?.avatarUrl);
      });
  }

  fileBrowserHandler(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];

    this.processFile(file);
  }

  onFileDropped(file: File) {
    this.processFile(file);
  }

  processFile(file: File | null | undefined) {
    if (!file || !file.type.match('image')) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      this.preview.set(event.target?.result?.toString() ?? '');
    };

    reader.readAsDataURL(file);

    this.avatar = file;
  }
}
