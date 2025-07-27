import { Injectable, signal } from '@angular/core';
import { Observable, of, Subscription, tap } from 'rxjs';

export interface Internship {
  value: string;
  name: string;
  professions: InternshipProfession[];
  subscription?: Subscription;
}

export interface InternshipProfession {
  value: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class MyMockService {
  internships = signal<Internship[]>([]);

  getInternships(): Observable<Internship[]> {
    return of([
      {
        value: 'web-development',
        name: 'Веб-разработка',
        professions: [
          {
            value: 'frontend-developer',
            name: 'Фронтенд-разработчик',
          },
          {
            value: 'backend-developer',
            name: 'Бэкенд-разработчик',
          },
        ],
      },
      {
        value: 'marketing',
        name: 'Маркетинг',
        professions: [
          {
            value: 'analyst',
            name: 'Аналитик',
          },
          {
            value: 'digital-marketer',
            name: 'Диджитал-маркетолог',
          },
          {
            value: 'smm-marketer',
            name: 'SMM-маркетолог',
          },
        ],
      },
    ]).pipe(
      tap((value) => {
        this.internships.set(value);
      })
    );
  }
}
