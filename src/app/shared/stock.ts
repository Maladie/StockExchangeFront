export class Stock {
  name: string;
  code: string;
  unit: number;
  price: number;

  constructor(name: string, code: string, unit: number, price: number) {
    this.name = name;
    this.code = code;
    this.unit = unit;
    this.price = price;
  }
}
