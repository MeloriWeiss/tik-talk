import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs';
import { Profile } from '../index';
import { GlobalStoreService, httpConfig, Pageable } from '../../shared/index';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  http = inject(HttpClient);
  #globalStoreService = inject(GlobalStoreService);

  me = signal<Profile | null>(null);
  filteredProfiles = signal<Profile[]>([]);

  baseApiUrl = httpConfig.baseApiUrl;

  getMe() {
    return this.http
      .get<Profile>(`${this.baseApiUrl}account/me`)
      .pipe(tap((res) => {
        this.me.set(res);
        this.#globalStoreService.me.set(res);
      }));
  }

  getAccount(id: string) {
    return this.http.get<Profile>(`${this.baseApiUrl}account/${id}`);
  }

  getSubscribersShortList(subsAmount = 3) {
    return this.http
      .get<Pageable<Profile>>(`${this.baseApiUrl}account/subscribers/`)
      .pipe(map((res) => res.items.slice(0, subsAmount)));
  }

  patchProfile(profile: Partial<Profile>) {
    return this.http
      .patch<Profile>(`${this.baseApiUrl}account/me`, profile)
      .pipe(
        tap((res) => {
          this.me.set(res);
        })
      );
  }

  uploadAvatar(file: File) {
    const fd = new FormData();
    fd.append('image', file);

    return this.http.post(`${this.baseApiUrl}account/upload_image`, fd);
  }

  filterProfiles(params: Record<string, any>) {
    return this.http
      .get<Pageable<Profile[]>>(`${this.baseApiUrl}account/accounts`, {
        params,
      })
      .pipe(
        tap((res) =>
          this.filteredProfiles.set(res.items as unknown as Profile[])
        )
      );
  }
}
