import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, timeout, catchError } from 'rxjs';
import { AboutForm, AboutCreateRequest, AboutResponse } from './about.model';

@Injectable({ providedIn: 'root' })
export class AboutService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/about'; // In real app, use environment.apiBaseUrl

  createAbout(aboutForm: AboutForm): Observable<AboutResponse> {
    const request: AboutCreateRequest = {
      name: aboutForm.name.trim(),
      email: aboutForm.email.trim(),
      company: aboutForm.company.trim() || undefined,
      message: aboutForm.message.trim(),
      interest: aboutForm.interest.trim()
    };

    return this.http.post<AboutResponse>(this.baseUrl, request).pipe(
      timeout(10000), // 10 second timeout
      catchError((error) => {
        console.error('About service error:', error);
        return throwError(() => new Error('Failed to send inquiry. Please try again.'));
      })
    );
  }

  // For demo purposes - simulate API call
  createAboutDemo(aboutForm: AboutForm): Observable<AboutResponse> {
    return new Observable((subscriber) => {
      setTimeout(() => {
        // Simulate random success/failure
        if (Math.random() > 0.2) {
          const response: AboutResponse = {
            id: Math.random().toString(36).substr(2, 9),
            name: aboutForm.name,
            email: aboutForm.email,
            company: aboutForm.company,
            message: aboutForm.message,
            interest: aboutForm.interest,
            createdAt: new Date().toISOString()
          };
          subscriber.next(response);
          subscriber.complete();
        } else {
          subscriber.error(new Error('Failed to send inquiry. Please try again.'));
        }
      }, 1500);
    });
  }
}
