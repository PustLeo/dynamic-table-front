import {Component, EventEmitter, HostBinding, HostListener, Input, Output} from "@angular/core";
import {CommonStaticService} from "@hospital/shared-module";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'filters-row',
  templateUrl: './filters-row.component.html',
  styleUrls: ['./filters-row.component.scss']
})
export class FiltersRowComponent {

  public trackByFn = CommonStaticService.trackByFn;

  @HostBinding('class')
  get view() {
    return  'table-body-filters' + ' ' + (this.model.viewFilters ? 'view' : '');
  }

  get columns(): any[] {
    return this.model?.columns || [];
  }

  get sort(): any {
    return this.model?.sort || {};
  }

  @Output()
  sorting: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  changeColumn: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  model: any;
}
