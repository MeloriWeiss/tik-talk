import { inject, Injectable } from '@angular/core';
import { ProfileService } from '../index';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { profileActions } from './actions';
import { map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileEffects {
  profileService = inject(ProfileService);
  actions$ = inject(Actions);

  filterProfiles = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.filterEvents),
      switchMap(({ filters }) => {
        return this.profileService.filterProfiles(filters);
      }),
      map((res) => profileActions.profilesLoaded({ profiles: res.items }))
    );
  });

  getMe = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.getMe),
      switchMap(() => {
        return this.profileService.getMe();
      }),
      map((res) => profileActions.meLoaded({ me: res }))
    );
  });

  patchProfile = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.patchProfile),
      switchMap(({ profile }) => {
        return this.profileService.patchProfile(profile);
      }),
      map((res) => profileActions.meLoaded({ me: res }))
    );
  });
}
