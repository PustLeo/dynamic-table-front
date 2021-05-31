import {Component, EventEmitter, HostBinding, Input, Output} from "@angular/core";
import {AbstractControl, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss']
})
export class DateFilterComponent {

  @HostBinding('class')
  readonly classValue: string = 'date';

  public form: FormGroup;

  @Input()
  set formControlVal(control: FormGroup) {
    this.form = control;
  }

  constructor() {
  }

  public get isGreater(): boolean {
    if (!this.form) {
      return false;
    }
    return this.form.get('operator').value === 'GREATER';
  }
  public get isLess(): boolean {
    if (!this.form) {
      return false;
    }
    return this.form.get('operator').value === 'LESS';
  }
  public get isEqual(): boolean {
    if (!this.form) {
      return false;
    }
    return this.form.get('operator').value === 'EQUALLY';
  }

  public changeOperator(operator: string): void {
    this.form.get('operator').patchValue(operator);
  }
}
