export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactCreateRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface FormErrors {
  name: string | null;
  email: string | null;
  subject: string | null;
  message: string | null;
}

export type ContactFormField = keyof ContactForm;
