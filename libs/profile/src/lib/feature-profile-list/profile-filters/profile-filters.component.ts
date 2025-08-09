import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SvgIconComponent } from '@tt/common-ui';
import { ProfileHeaderComponent } from '../../ui/index';
import { profileActions, selectProfileFilters } from '@tt/data-access/profile';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-profile-filters',
  standalone: true,
  imports: [
    FormsModule,
    ProfileHeaderComponent,
    ReactiveFormsModule,
    SvgIconComponent,
  ],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFiltersComponent {
  fb = inject(FormBuilder);
  store = inject(Store);

  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    city: [''],
    stack: [''],
  });

  constructor() {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        takeUntilDestroyed(),
        filter((formValue) =>
          Object.values(formValue).every((value) =>
            value?.length !== 0 ? (value?.length || 0) > 2 : true
          )
        )
      )
      .subscribe((formValue) => {
        this.store.dispatch(
          profileActions.filterEvents({ filters: formValue })
        );
      });

    this.searchForm.patchValue(this.store.selectSignal(selectProfileFilters)());
  }
}
