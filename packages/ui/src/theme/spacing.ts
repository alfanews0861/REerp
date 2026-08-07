export const spacingMultiplier = 8;

export function spacing(factor: number): string {
  return `${factor * spacingMultiplier}px`;
}
