import { Component, inject } from '@angular/core';
import { ProfileFiltersComponent } from '../index';
import { ProfileService } from '../../data/index';
import { ProfileCardComponent } from '../../ui';

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
