import {Component, HostBinding, Input} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {Debounce} from "@decorators/debounce.decorator";

@Component({
  selector: 'integer-filter',
  templateUrl: './integer-filter.component.html',
  styleUrls: ['./integer-filter.component.scss']
})
export class IntegerFilterComponent {

  public form: FormGroup;
  public search: string;
  public init: boolean = false;

  @Input()
  set formControlVal(control: FormGroup) {
    this.form = control;
    this.init = false;
    if (control) {
      this.search = control.get('value').value;
      this.init = true;
    }
  }

  @Debounce(550)
  public change(value: string): void {
    if (!this.init) {
      return;
    }
    this.form.get('value').patchValue(value);
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
