export class DateUtil {
  static format = 'YYYY-MM-DD HH:mm:ss.SSS';

  private static formatStr(date: Date, formatStr: string): string {
    const pad = (n: number, width = 2) => String(n).padStart(width, '0');
    return formatStr
      .replace('YYYY', String(date.getFullYear()))
      .replace('MM', pad(date.getMonth() + 1))
      .replace('DD', pad(date.getDate()))
      .replace('HH', pad(date.getHours()))
      .replace('mm', pad(date.getMinutes()))
      .replace('ss', pad(date.getSeconds()))
      .replace('SSS', pad(date.getMilliseconds(), 3));
  }

  // Get current date-time in default format
  static getCurrentDateTime(): string {
    return this.formatStr(new Date(), this.format);
  }

  // Extract only date from a date-time string
  static toDateOnly(date: Date | string): string {
    return this.formatStr(new Date(date), 'YYYY-MM-DD');
  }

  // Check the date range is valid or not
  static isValidDateRange(minDate: string, maxDate: string): boolean {
    return new Date(minDate).getTime() < new Date(maxDate).getTime();
  }
}
