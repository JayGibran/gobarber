import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string;
}

export default function getValidationError(err: ValidationError): Errors {
  const validationsError: Errors = {};
  err.inner.forEach((error) => {
    validationsError[error.path] = error.message;
  });
  return validationsError;
}
