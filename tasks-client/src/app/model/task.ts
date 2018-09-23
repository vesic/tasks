
export class Task {
  sortStatusBy: string;

  constructor(
    private _id: number = -1,
    private _summary: string = 'New Task.',
    private _description: string = 'New Task.',
    private _date: Date = new Date(),
    private _status: any = { name: 'Pending', code: false }
  ) { }

  get id(): number {
    return this._id;
  }

  set id(id: number) {
    this._id = id;
  }

  get summary(): string {
    return this._summary;
  }

  set summary(summary: string) {
    this._summary = summary;
  }

  get description(): string {
    return this._description;
  }

  set description(description: string) {
    this._description = description;
  }

  get date(): Date {
    return this._date;
  }

  set date(date: Date) {
    this._date = date;
  }

  get status(): { name: string, code: boolean } {
    return this._status;
  }

  set status(status) {
    this._status = status;
    this.sortStatusBy = status.name;
  }
}
