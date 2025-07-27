export class DateUtil {
  private static baseHours = 'час';
  private static baseMinutes = 'минут';
  private static baseSeconds = 'секунд';

  // static createCorrectDateString(day: number, month: number, year: number): string {
  //   return `${this.toCorrectDatePart(day)}.${this.toCorrectDatePart(month)}.${this.toCorrectDatePart(year)}`;
  // }
  //
  // private static toCorrectDatePart(datePart: number): string {
  //   return `${String(datePart).length < 2 ? ('0' + datePart) : datePart}`;
  // }

  static createCorrectDateString(
    separator: string,
    ...dateParts: number[]
  ): string {
    return dateParts
      .map((part) => {
        const strPart = String(part);
        return strPart.length < 2 ? '0' + strPart : strPart;
      })
      .join(separator);
  }

  static getEndOfHoursBack(hours: number): string {
    if (hours > 4 && hours < 21) {
      return this.baseHours + 'ов';
    }
    if (hours > 1 && hours !== 21) {
      return this.baseHours + 'а';
    }
    return this.baseHours;
  }

  static getEndOfMinutesBack(minutes: number): string {
    if (
      (minutes > 4 && minutes < 21) ||
      (minutes > 24 && (minutes % 10 > 4 || minutes % 10 === 0))
    ) {
      return this.baseMinutes;
    }
    if (minutes % 10 > 1) {
      return this.baseMinutes + 'ы';
    }
    return this.baseMinutes + 'у';
  }

  static getEndOfSecondsBack(seconds: number): string {
    if (seconds % 10 > 4 || (seconds > 10 && seconds < 15)) {
      return this.baseSeconds;
    }
    if (seconds % 10 > 1) {
      return this.baseSeconds + 'ы';
    }
    return this.baseSeconds + 'у';
  }
}
