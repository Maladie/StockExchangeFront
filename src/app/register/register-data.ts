export class RegisterData {
  username: string;
  password: string;
  name: string;
  surname: string;
  cash: number;
  currency = 'PLN';

  constructor(username: string, password: string, name: string, surname: string, money: number) {
    this.username = username;
    this.password = password;
    this.name = name;
    this.surname = surname;
    this.cash = money;
  }
}
