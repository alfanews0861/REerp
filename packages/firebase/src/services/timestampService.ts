import { Timestamp } from 'firebase/firestore';

export class TimestampService {
  public static nowIso(): string {
    return new Date().toISOString();
  }

  public static nowTimestamp(): Timestamp {
    return Timestamp.now();
  }

  public static toTimestamp(dateOrIso: Date | string | number): Timestamp {
    if (dateOrIso instanceof Date) {
      return Timestamp.fromDate(dateOrIso);
    }
    if (typeof dateOrIso === 'number') {
      return Timestamp.fromMillis(dateOrIso);
    }
    return Timestamp.fromDate(new Date(dateOrIso));
  }

  public static toIsoString(timestampOrDate: Timestamp | Date | string): string {
    if (timestampOrDate instanceof Timestamp) {
      return timestampOrDate.toDate().toISOString();
    }
    if (timestampOrDate instanceof Date) {
      return timestampOrDate.toISOString();
    }
    return new Date(timestampOrDate).toISOString();
  }

  public static formatDisplayDate(dateOrIso: Date | string, locale: string = 'en-US'): string {
    const d = typeof dateOrIso === 'string' ? new Date(dateOrIso) : dateOrIso;
    return d.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  public static formatDisplayDateTime(dateOrIso: Date | string, locale: string = 'en-US'): string {
    const d = typeof dateOrIso === 'string' ? new Date(dateOrIso) : dateOrIso;
    return d.toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
