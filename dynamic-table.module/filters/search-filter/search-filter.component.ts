import {Component, HostBinding, Input} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {Debounce} from "@decorators/debounce.decorator";

@Component({
  selector: 'search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent {

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
}
