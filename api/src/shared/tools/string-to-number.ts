export class StringToNumber {
  static toNumber(value: string): number {
    const num = +value;
    if (isNaN(num)) throw new Error(`String ${value} is not a number`);
    return num / 100;
  }
  static toString(value: number): string {
    return (value * 100).toFixed(0);
  }
}
