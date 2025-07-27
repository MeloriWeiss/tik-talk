import { Component, inject } from '@angular/core';
import { ProfileFiltersComponent } from '../index';
import { ProfileCardComponent } from '../../ui';
import { ProfileService } from '@tt/data-access/profile';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ProfileCardComponent, ProfileFiltersComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {
  profileService = inject(ProfileService);
  profiles = this.profileService.filteredProfiles;
}
