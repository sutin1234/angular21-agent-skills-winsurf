import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ContactFormComponent } from './contact-form.component';
import { ContactService } from '../contact.service';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;
  let contactService: jasmine.SpyObj<ContactService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ContactService', ['createContactDemo']);

    await TestBed.configureTestingModule({
      imports: [ContactFormComponent],
      providers: [
        provideRouter([]),
        { provide: ContactService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    contactService = TestBed.inject(ContactService) as jasmine.SpyObj<ContactService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.name()).toBe('');
    expect(component.email()).toBe('');
    expect(component.subject()).toBe('');
    expect(component.message()).toBe('');
    expect(component.loading()).toBe(false);
    expect(component.submitted()).toBe(false);
    expect(component.submitSuccess()).toBe(false);
    expect(component.submitError()).toBeNull();
  });

  it('should validate name field', () => {
    component.onNameInput('');
    expect(component.isNameInvalid()).toBe(true);
    expect(component.getNameError()).toBe('Name is required');

    component.onNameInput('a');
    expect(component.isNameInvalid()).toBe(true);
    expect(component.getNameError()).toBe('Name must be at least 2 characters');

    component.onNameInput('Valid Name');
    expect(component.isNameInvalid()).toBe(false);
    expect(component.getNameError()).toBeNull();
  });

  it('should validate email field', () => {
    component.onEmailInput('');
    expect(component.isEmailInvalid()).toBe(true);
    expect(component.getEmailError()).toBe('Email is required');

    component.onEmailInput('invalid-email');
    expect(component.isEmailInvalid()).toBe(true);
    expect(component.getEmailError()).toBe('Please enter a valid email address');

    component.onEmailInput('valid@example.com');
    expect(component.isEmailInvalid()).toBe(false);
    expect(component.getEmailError()).toBeNull();
  });

  it('should validate subject field', () => {
    component.onSubjectInput('');
    expect(component.isSubjectInvalid()).toBe(true);
    expect(component.getSubjectError()).toBe('Subject is required');

    component.onSubjectInput('abc');
    expect(component.isSubjectInvalid()).toBe(true);
    expect(component.getSubjectError()).toBe('Subject must be at least 5 characters');

    component.onSubjectInput('Valid Subject');
    expect(component.isSubjectInvalid()).toBe(false);
    expect(component.getSubjectError()).toBeNull();
  });

  it('should validate message field', () => {
    component.onMessageInput('');
    expect(component.isMessageInvalid()).toBe(true);
    expect(component.getMessageError()).toBe('Message is required');

    component.onMessageInput('short');
    expect(component.isMessageInvalid()).toBe(true);
    expect(component.getMessageError()).toBe('Message must be at least 10 characters');

    component.onMessageInput('This is a valid message with enough characters');
    expect(component.isMessageInvalid()).toBe(false);
    expect(component.getMessageError()).toBeNull();
  });

  it('should check form validity', () => {
    expect(component.isFormValid()).toBe(false);

    component.onNameInput('Valid Name');
    component.onEmailInput('valid@example.com');
    component.onSubjectInput('Valid Subject');
    component.onMessageInput('This is a valid message with enough characters');

    expect(component.isFormValid()).toBe(true);
  });

  it('should reset form', () => {
    component.onNameInput('Test Name');
    component.onEmailInput('test@example.com');
    component.onSubjectInput('Test Subject');
    component.onMessageInput('Test message');
    component.submitted.set(true);
    component.submitSuccess.set(true);

    component.resetForm();

    expect(component.name()).toBe('');
    expect(component.email()).toBe('');
    expect(component.subject()).toBe('');
    expect(component.message()).toBe('');
    expect(component.submitted()).toBe(false);
    expect(component.submitSuccess()).toBe(false);
    expect(component.submitError()).toBeNull();
  });

  it('should submit form successfully', () => {
    component.onNameInput('Test Name');
    component.onEmailInput('test@example.com');
    component.onSubjectInput('Test Subject');
    component.onMessageInput('Test message with enough characters');

    const mockResponse = {
      id: '123',
      name: 'Test Name',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'Test message with enough characters',
      createdAt: new Date().toISOString()
    };

    contactService.createContactDemo.and.returnValue(asyncData(mockResponse));

    component.onSubmit();

    expect(component.loading()).toBe(true);
    expect(contactService.createContactDemo).toHaveBeenCalledWith({
      name: 'Test Name',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'Test message with enough characters'
    });

    // Wait for async response
    fixture.whenStable().then(() => {
      expect(component.loading()).toBe(false);
      expect(component.submitSuccess()).toBe(true);
      expect(component.submitted()).toBe(true);
    });
  });

  it('should handle form submission error', () => {
    component.onNameInput('Test Name');
    component.onEmailInput('test@example.com');
    component.onSubjectInput('Test Subject');
    component.onMessageInput('Test message with enough characters');

    const error = new Error('Submission failed');
    contactService.createContactDemo.and.returnValue(asyncError(error));

    component.onSubmit();

    expect(component.loading()).toBe(true);

    // Wait for async response
    fixture.whenStable().then(() => {
      expect(component.loading()).toBe(false);
      expect(component.submitSuccess()).toBe(false);
      expect(component.submitError()).toBe('Submission failed');
    });
  });

  it('should not submit invalid form', () => {
    component.onSubmit();

    expect(contactService.createContactDemo).not.toHaveBeenCalled();
    expect(component.loading()).toBe(false);
  });

  it('should not submit while loading', () => {
    component.loading.set(true);
    component.onNameInput('Test Name');
    component.onEmailInput('test@example.com');
    component.onSubjectInput('Test Subject');
    component.onMessageInput('Test message with enough characters');

    component.onSubmit();

    expect(contactService.createContactDemo).not.toHaveBeenCalled();
  });
});

// Helper functions for testing
function asyncData<T>(data: T) {
  return Promise.resolve(data);
}

function asyncError<T>(error: any) {
  return Promise.reject(error);
}
