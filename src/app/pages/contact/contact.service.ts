import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, timeout, catchError } from 'rxjs';
import { ContactForm, ContactCreateRequest, ContactResponse } from './contact.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/contact'; // In real app, use environment.apiBaseUrl

  createContact(contactForm: ContactForm): Observable<ContactResponse> {
    const request: ContactCreateRequest = {
      name: contactForm.name.trim(),
      email: contactForm.email.trim(),
      subject: contactForm.subject.trim(),
      message: contactForm.message.trim()
    };

    return this.http.post<ContactResponse>(this.baseUrl, request).pipe(
      timeout(10000), // 10 second timeout
      catchError((error) => {
        console.error('Contact service error:', error);
        return throwError(() => new Error('Failed to send message. Please try again.'));
      })
    );
  }

  // For demo purposes - simulate API call
  createContactDemo(contactForm: ContactForm): Observable<ContactResponse> {
    return new Observable((subscriber) => {
      setTimeout(() => {
        // Simulate random success/failure
        if (Math.random() > 0.2) {
          const response: ContactResponse = {
            id: Math.random().toString(36).substr(2, 9),
            name: contactForm.name,
            email: contactForm.email,
            subject: contactForm.subject,
            message: contactForm.message,
            createdAt: new Date().toISOString()
          };
          subscriber.next(response);
          subscriber.complete();
        } else {
          subscriber.error(new Error('Failed to send message. Please try again.'));
        }
      }, 1500);
    });
  }
}
