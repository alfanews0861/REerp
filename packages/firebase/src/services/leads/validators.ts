import { LeadCaptureRequestDTO } from './dto';

export class LeadValidator {
  public static validateCaptureRequest(dto: LeadCaptureRequestDTO): void {
    const errors: string[] = [];

    if (!dto.companyId) errors.push('companyId is required');
    if (!dto.branchId) errors.push('branchId is required');
    if (!dto.sourceCode) errors.push('sourceCode is required');
    if (!dto.firstName) errors.push('firstName is required');
    if (!dto.phone) errors.push('phone is required');

    if (errors.length > 0) {
      throw new Error(`Lead validation failed: ${errors.join(', ')}`);
    }
  }
}
