import { Injectable } from '@angular/core';
import {Observable, of, Subscription} from "rxjs";

export interface InternshipsListItem {
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
  providedIn: 'root'
})
export class MyMockTodoService {

  getInternships(): Observable<InternshipsListItem[]> {
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
        ]
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
        ]
      },
    ])
  }
}
