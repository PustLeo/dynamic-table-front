import {Component, Input} from "@angular/core";
import {AbstractControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'filter-entity',
  templateUrl: './filter-entity.component.html',
  styleUrls: ['./filter-entity.component.scss']
})
export class FilterEntityComponent {

  @Input()
  model: FormGroup;

  public get currentType(): string {
    if (!this.model) {
      return '';
    }
    return this.model.get('type')
      .get('type').value;
  }

  public get currentSubtype(): string {
    if (!this.model) {
      return '';
    }
    return this.model.get('type')
      .get('subType').value;
  }

  public get currentValue(): AbstractControl {
    if (!this.model) {
      return null;
    }
    return this.model.get('value');
  }

  constructor() {
  }
}
