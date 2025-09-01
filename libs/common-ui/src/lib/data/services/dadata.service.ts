import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DADATA_TOKEN } from './dadata-token';
import { map } from 'rxjs';
import { DadataSuggestions } from '../interfaces/dadata.interface';

@Injectable({
  providedIn: 'root',
})
export class DadataService {
  #http = inject(HttpClient);

  #apiUrl =
    'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';

  getSuggestion(query: string) {
    return this.#http
      .post<DadataSuggestions>(
        this.#apiUrl,
        { query },
        {
          headers: {
            Authorization: `Token ${DADATA_TOKEN}`,
          },
        }
      )
      .pipe(
        map((res) => {
          return res.suggestions;
          // const cities = res.suggestions
          //   .map((sug) => sug.data.city)
          //   .filter((city) => city);
          //
          // return Array.from(new Set(cities));
        })
      );
  }
}
