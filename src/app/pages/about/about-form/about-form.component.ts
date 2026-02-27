import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, DestroyRef, InjectionToken, input, output, linkedSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AboutService } from '../about.service';
import { AboutForm, FormErrors, AboutFormField } from '../about.model';

// Injection token for form configuration (DI best practice)
export const ABOUT_FORM_CONFIG = new InjectionToken<AboutFormConfig>('AboutFormConfig');

export interface AboutFormConfig {
  maxMessageLength: number;
  enableAnalytics: boolean;
  submitTimeout: number;
}

export interface AboutFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
  interest: string;
}

@Component({
  selector: 'app-about-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 
    class: 'app-about-form',
    '[class.loading]': 'loading()',
    '[class.submitted]': 'submitted()',
    '[attr.aria-busy]': 'loading()',
    '[attr.aria-live]': 'loading() ? "polite" : "off"',
    'role': 'form'
  },
  imports: [CommonModule],
  templateUrl: './about-form.component.html'
})
export class AboutFormComponent {
  private readonly aboutService = inject(AboutService);
  private readonly destroyRef = inject(DestroyRef);
  readonly config = inject(ABOUT_FORM_CONFIG, { optional: true }) ?? {
    maxMessageLength: 500,
    enableAnalytics: false,
    submitTimeout: 10000
  };

  // Signal inputs for parent component configuration
  readonly initialData = input<Partial<AboutFormData>>({});
  readonly showCompanyField = input(true, { transform: (value: unknown) => Boolean(value) });
  readonly disabled = input(false, { transform: (value: unknown) => Boolean(value) });
  readonly readonly = input(false, { transform: (value: unknown) => Boolean(value) });

  // Signal outputs for parent component communication
  readonly formSubmitted = output<AboutFormData>();
  readonly formReset = output<void>();
  readonly formDataChange = output<AboutFormData>();
  readonly formStateChange = output<'loading' | 'success' | 'error'>();

  // Form data signals - readonly for immutability
  readonly name = linkedSignal(() => this.initialData()?.name ?? '');
  readonly email = linkedSignal(() => this.initialData()?.email ?? '');
  readonly company = linkedSignal(() => this.initialData()?.company ?? '');
  readonly message = linkedSignal(() => this.initialData()?.message ?? '');
  readonly interest = linkedSignal(() => this.initialData()?.interest ?? '');

  // Form state signals - optimized with linkedSignal for derived state
  readonly touched = signal<Set<AboutFormField>>(new Set());
  readonly loading = signal(false);
  readonly submitted = signal(false);
  readonly submitSuccess = signal(false);
  readonly submitError = signal<string | null>(null);

  // Performance optimization: memoized validation state
  readonly hasValidationErrors = computed(() => 
    this.nameError() !== null || 
    this.emailError() !== null || 
    this.companyError() !== null ||
    this.messageError() !== null || 
    this.interestError() !== null
  );

  // Performance optimization: memoized form completion state
  readonly allRequiredFieldsFilled = computed(() => 
    this.name().trim() !== '' &&
    this.email().trim() !== '' &&
    this.message().trim() !== '' &&
    this.interest().trim() !== ''
  );

  // Interest options as computed signal for better performance
  readonly interestOptions = computed(() => [
    'General Inquiry',
    'Partnership',
    'Career Opportunities',
    'Technical Support',
    'Sales',
    'Other'
  ]);

  // Computed form data for output emission
  readonly formData = computed<AboutFormData>(() => ({
    name: this.name(),
    email: this.email(),
    company: this.company(),
    message: this.message(),
    interest: this.interest()
  }));

  // Computed signals for template - pure and performant
  readonly isFormDisabled = computed(() => this.disabled() || this.loading());
  readonly isFormReadonly = computed(() => this.readonly() || this.loading());

  // Validation functions - static for better performance
  private static validateName(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return 'Name is required';
    if (trimmed.length < 2) return 'Name must be at least 2 characters';
    if (trimmed.length > 50) return 'Name must be less than 50 characters';
    return null;
  }

  private static validateEmail(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return 'Email is required';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) return 'Please enter a valid email address';
    return null;
  }

  private static validateCompany(value: string): string | null {
    const trimmed = value.trim();
    if (trimmed && trimmed.length > 100) return 'Company name must be less than 100 characters';
    return null;
  }

  private static validateMessage(value: string, maxLength: number): string | null {
    const trimmed = value.trim();
    if (!trimmed) return 'Message is required';
    if (trimmed.length < 10) return 'Message must be at least 10 characters';
    if (trimmed.length > maxLength) return `Message must be less than ${maxLength} characters`;
    return null;
  }

  private static validateInterest(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return 'Please select an area of interest';
    return null;
  }

  // Computed validation signals - pure and reactive
  readonly nameError = computed(() => {
    const touchedFields = this.touched();
    if (!touchedFields.has('name') && !this.submitted()) return null;
    return AboutFormComponent.validateName(this.name());
  });

  readonly emailError = computed(() => {
    const touchedFields = this.touched();
    if (!touchedFields.has('email') && !this.submitted()) return null;
    return AboutFormComponent.validateEmail(this.email());
  });

  readonly companyError = computed(() => {
    const touchedFields = this.touched();
    if (!touchedFields.has('company') && !this.submitted()) return null;
    return AboutFormComponent.validateCompany(this.company());
  });

  readonly messageError = computed(() => {
    const touchedFields = this.touched();
    if (!touchedFields.has('message') && !this.submitted()) return null;
    return AboutFormComponent.validateMessage(this.message(), this.config.maxMessageLength);
  });

  readonly interestError = computed(() => {
    const touchedFields = this.touched();
    if (!touchedFields.has('interest') && !this.submitted()) return null;
    return AboutFormComponent.validateInterest(this.interest());
  });

  // Computed form validity - optimized with memoized signals
  readonly isFormValid = computed(() => 
    !this.hasValidationErrors() && this.allRequiredFieldsFilled()
  );

  // Character count for message field
  readonly messageCharCount = computed(() => this.message().length);
  readonly messageCharCountRemaining = computed(() => 
    this.config.maxMessageLength - this.messageCharCount()
  );
  readonly isMessageNearLimit = computed(() => 
    this.messageCharCountRemaining() <= 50
  );

  // About info items for the template - static data as computed signal
  readonly aboutInfoItems = computed(() => [
    {
      title: 'Our Mission',
      icon: '🎯',
      content: 'To create innovative solutions that transform businesses and improve lives through technology.'
    },
    {
      title: 'Our Values',
      icon: '💎',
      content: 'Integrity, Innovation, Excellence, and Customer Success guide everything we do.'
    },
    {
      title: 'Our Team',
      icon: '👥',
      content: 'A diverse group of talented professionals passionate about making a difference.'
    }
  ]);

  constructor() {
    // Emit form data changes - optimized effect
    effect(() => {
      if (!this.isFormReadonly()) {
        this.formDataChange.emit(this.formData());
      }
    });

    // Effect for analytics tracking (development only) - optimized with conditional logging
    effect(() => {
      if (this.config.enableAnalytics && this.loading()) {
        console.log('About form submission started - analytics tracking enabled');
        this.formStateChange.emit('loading');
      }
    });

    // Effect for form completion tracking - optimized to avoid unnecessary computations
    effect(() => {
      if (this.config.enableAnalytics && this.isFormValid() && !this.loading()) {
        console.log('About form is ready for submission');
      }
    });
  }

  // Input event handlers - optimized for performance
  onNameInput(value: string): void {
    if (!this.isFormReadonly()) {
      this.name.set(value);
      this.markAsTouched('name');
    }
  }

  onEmailInput(value: string): void {
    if (!this.isFormReadonly()) {
      this.email.set(value);
      this.markAsTouched('email');
    }
  }

  onCompanyInput(value: string): void {
    if (!this.isFormReadonly()) {
      this.company.set(value);
      this.markAsTouched('company');
    }
  }

  onMessageInput(value: string): void {
    if (!this.isFormReadonly()) {
      this.message.set(value);
      this.markAsTouched('message');
    }
  }

  onInterestChange(value: string): void {
    if (!this.isFormReadonly()) {
      this.interest.set(value);
      this.markAsTouched('interest');
    }
  }

  // Blur event handlers
  onNameBlur(): void {
    this.markAsTouched('name');
  }

  onEmailBlur(): void {
    this.markAsTouched('email');
  }

  onCompanyBlur(): void {
    this.markAsTouched('company');
  }

  onMessageBlur(): void {
    this.markAsTouched('message');
  }

  private markAsTouched(field: AboutFormField): void {
    if (!this.isFormReadonly()) {
      this.touched.update(current => {
        // Performance optimization: avoid creating new Set if field already touched
        if (current.has(field)) {
          return current;
        }
        const newTouched = new Set(current);
        newTouched.add(field);
        return newTouched;
      });
    }
  }

  // Form submission with proper error handling and cleanup
  onSubmit(): void {
    // Performance optimization: early return for disabled/readonly forms
    if (this.isFormDisabled()) {
      return;
    }

    // Mark all fields as touched for validation - optimized Set creation
    const allFields = new Set<AboutFormField>(['name', 'email', 'company', 'message', 'interest']);
    this.touched.set(allFields);
    
    // Performance optimization: use memoized validation state
    if (!this.isFormValid()) {
      return;
    }

    this.loading.set(true);
    this.submitError.set(null);

    const aboutForm = this.formData();

    // Emit form submitted event
    this.formSubmitted.emit(aboutForm);

    // Convert to AboutForm type for service - optimized object creation
    const serviceForm: AboutForm = {
      name: aboutForm.name,
      email: aboutForm.email,
      company: aboutForm.company || '',
      message: aboutForm.message,
      interest: aboutForm.interest
    };

    // Use takeUntilDestroyed for automatic cleanup
    this.aboutService.createAboutDemo(serviceForm)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log('About form submitted successfully:', response);
          this.submitSuccess.set(true);
          this.submitted.set(true);
          this.formStateChange.emit('success');
          this.resetForm();
          this.loading.set(false);
          
          // Analytics tracking
          if (this.config.enableAnalytics) {
            console.log('About form submission completed - tracking event');
          }
        },
        error: (error) => {
          console.error('About form submission error:', error);
          this.submitError.set(error.message || 'Failed to send inquiry. Please try again.');
          this.formStateChange.emit('error');
          this.loading.set(false);
        }
      });
  }

  resetForm(): void {
    // Performance optimization: batch signal updates to minimize change detection cycles
    this.name.set('');
    this.email.set('');
    this.company.set('');
    this.message.set('');
    this.interest.set('');
    this.touched.set(new Set());
    this.submitted.set(false);
    this.submitSuccess.set(false);
    this.submitError.set(null);
    
    // Emit reset event
    this.formReset.emit();
  }

  // Public methods for parent component interaction - optimized for performance
  focusField(fieldName: AboutFormField): void {
    // Performance optimization: use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      const element = document.getElementById(fieldName);
      if (element) {
        element.focus();
      }
    });
  }

  scrollToTop(): void {
    // Performance optimization: use requestAnimationFrame for smooth scrolling
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Performance optimization: method to validate single field
  validateField(fieldName: AboutFormField): string | null {
    const validators = {
      name: () => AboutFormComponent.validateName(this.name()),
      email: () => AboutFormComponent.validateEmail(this.email()),
      company: () => AboutFormComponent.validateCompany(this.company()),
      message: () => AboutFormComponent.validateMessage(this.message(), this.config.maxMessageLength),
      interest: () => AboutFormComponent.validateInterest(this.interest())
    };
    
    return validators[fieldName]();
  }

  // Helper methods for template - optimized to avoid function calls in template
  readonly getNameError = this.nameError;
  readonly getEmailError = this.emailError;
  readonly getCompanyError = this.companyError;
  readonly getMessageError = this.messageError;
  readonly getInterestError = this.interestError;

  readonly isNameInvalid = computed(() => this.nameError() !== null);
  readonly isEmailInvalid = computed(() => this.emailError() !== null);
  readonly isCompanyInvalid = computed(() => this.companyError() !== null);
  readonly isMessageInvalid = computed(() => this.messageError() !== null);
  readonly isInterestInvalid = computed(() => this.interestError() !== null);
}
