import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Profile } from '../index';

export const profileActions = createActionGroup({
  source: 'profile',
  events: {
    'filter events': props<{ filters: Record<string, any> }>(),
    'profiles loaded': props<{ profiles: Profile[] }>(),

    'get me': emptyProps(),
    'me loaded': props<{ me: Profile }>(),

    'patch profile': props<{ profile: Partial<Profile> }>(),
  },
});
