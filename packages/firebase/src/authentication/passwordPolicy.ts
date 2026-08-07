import { PasswordPolicyConfig, PasswordValidationResult } from '@real-estate-erp/types';

export const DEFAULT_PASSWORD_POLICY: PasswordPolicyConfig = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialCharacters: true,
};

export function validatePassword(
  password: string,
  config: PasswordPolicyConfig = DEFAULT_PASSWORD_POLICY
): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < config.minLength) {
    errors.push(`Password must be at least ${config.minLength} characters long.`);
  }
  if (config.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter.');
  }
  if (config.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter.');
  }
  if (config.requireNumbers && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number.');
  }
  if (config.requireSpecialCharacters && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Password must contain at least one special character.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
