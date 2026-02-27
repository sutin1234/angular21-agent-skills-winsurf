import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContactService } from '../contact.service';
import { ContactForm, FormErrors, ContactFormField } from '../contact.model';

@Component({
  selector: 'app-contact-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 
    class: 'app-contact-form',
    '[class.loading]': 'loading()',
    '[class.submitted]': 'submitted()'
  },
  imports: [CommonModule],
  templateUrl: './contact-form.component.html'
})
export class ContactFormComponent {
  private readonly contactService = inject(ContactService);
  private readonly destroyRef = inject(DestroyRef);

  // Form data signals
  readonly name = signal('');
  readonly email = signal('');
  readonly subject = signal('');
  readonly message = signal('');

  // Form state signals
  readonly touched = signal<Set<ContactFormField>>(new Set());
  readonly loading = signal(false);
  readonly submitted = signal(false);
  readonly submitSuccess = signal(false);
  readonly submitError = signal<string | null>(null);

  // Validation functions - pure functions for computed signals
  private static validateName(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return 'Name is required';
    if (trimmed.length < 2) return 'Name must be at least 2 characters';
    return null;
  }

  private static validateEmail(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return 'Email is required';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) return 'Please enter a valid email address';
    return null;
  }

  private static validateSubject(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return 'Subject is required';
    if (trimmed.length < 5) return 'Subject must be at least 5 characters';
    return null;
  }

  private static validateMessage(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return 'Message is required';
    if (trimmed.length < 10) return 'Message must be at least 10 characters';
    return null;
  }

  // Computed validation signals - pure and reactive
  readonly nameError = computed(() => {
    const touchedFields = this.touched();
    if (!touchedFields.has('name') && !this.submitted()) return null;
    return ContactFormComponent.validateName(this.name());
  });

  readonly emailError = computed(() => {
    const touchedFields = this.touched();
    if (!touchedFields.has('email') && !this.submitted()) return null;
    return ContactFormComponent.validateEmail(this.email());
  });

  readonly subjectError = computed(() => {
    const touchedFields = this.touched();
    if (!touchedFields.has('subject') && !this.submitted()) return null;
    return ContactFormComponent.validateSubject(this.subject());
  });

  readonly messageError = computed(() => {
    const touchedFields = this.touched();
    if (!touchedFields.has('message') && !this.submitted()) return null;
    return ContactFormComponent.validateMessage(this.message());
  });

  // Computed form validity - pure computation
  readonly isFormValid = computed(() => {
    return !this.nameError() && 
           !this.emailError() && 
           !this.subjectError() && 
           !this.messageError() &&
           this.name().trim() !== '' &&
           this.email().trim() !== '' &&
           this.subject().trim() !== '' &&
           this.message().trim() !== '';
  });

  // Form data as computed object - useful for submission
  readonly formData = computed<ContactForm>(() => ({
    name: this.name(),
    email: this.email(),
    subject: this.subject(),
    message: this.message()
  }));

  // Contact info items for the template - static data as computed signal
  readonly contactInfoItems = computed(() => [
    {
      title: 'Email',
      icon: '📧',
      content: 'contact@angular21.com'
    },
    {
      title: 'Phone',
      icon: '📞',
      content: '+1 (555) 123-4567'
    },
    {
      title: 'Address',
      icon: '📍',
      content: '123 Angular Street\nWeb City, WC 12345'
    }
  ]);

  constructor() {
    // Effect for logging form state changes (development only)
    effect(() => {
      if (this.loading()) {
        console.log('Contact form submission started');
      }
    });
  }

  // Input event handlers - optimized for performance
  onNameInput(value: string): void {
    this.name.set(value);
    this.markAsTouched('name');
  }

  onEmailInput(value: string): void {
    this.email.set(value);
    this.markAsTouched('email');
  }

  onSubjectInput(value: string): void {
    this.subject.set(value);
    this.markAsTouched('subject');
  }

  onMessageInput(value: string): void {
    this.message.set(value);
    this.markAsTouched('message');
  }

  // Blur event handlers
  onNameBlur(): void {
    this.markAsTouched('name');
  }

  onEmailBlur(): void {
    this.markAsTouched('email');
  }

  onSubjectBlur(): void {
    this.markAsTouched('subject');
  }

  onMessageBlur(): void {
    this.markAsTouched('message');
  }

  private markAsTouched(field: ContactFormField): void {
    this.touched.update(current => {
      const newTouched = new Set(current);
      newTouched.add(field);
      return newTouched;
    });
  }

  // Form submission with proper error handling and cleanup
  onSubmit(): void {
    // Mark all fields as touched for validation
    this.touched.set(new Set(['name', 'email', 'subject', 'message']));
    
    if (!this.isFormValid() || this.loading()) {
      return;
    }

    this.loading.set(true);
    this.submitError.set(null);

    const contactForm = this.formData();

    // Use takeUntilDestroyed for automatic cleanup
    this.contactService.createContactDemo(contactForm)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log('Contact form submitted successfully:', response);
          this.submitSuccess.set(true);
          this.submitted.set(true);
          this.resetForm();
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Contact form submission error:', error);
          this.submitError.set(error.message || 'Failed to send message. Please try again.');
          this.loading.set(false);
        }
      });
  }

  resetForm(): void {
    this.name.set('');
    this.email.set('');
    this.subject.set('');
    this.message.set('');
    this.touched.set(new Set());
    this.submitted.set(false);
    this.submitSuccess.set(false);
    this.submitError.set(null);
  }

  // Helper methods for template - optimized to avoid function calls in template
  readonly getNameError = this.nameError;
  readonly getEmailError = this.emailError;
  readonly getSubjectError = this.subjectError;
  readonly getMessageError = this.messageError;

  readonly isNameInvalid = computed(() => this.nameError() !== null);
  readonly isEmailInvalid = computed(() => this.emailError() !== null);
  readonly isSubjectInvalid = computed(() => this.subjectError() !== null);
  readonly isMessageInvalid = computed(() => this.messageError() !== null);
}
