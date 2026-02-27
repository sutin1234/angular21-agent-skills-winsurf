export interface AboutForm {
  name: string;
  email: string;
  company: string;
  message: string;
  interest: string;
}

export interface AboutCreateRequest {
  name: string;
  email: string;
  company?: string;
  message: string;
  interest: string;
}

export interface AboutResponse {
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  interest: string;
  createdAt: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
  interest?: string;
}

export type AboutFormField = keyof AboutForm;
