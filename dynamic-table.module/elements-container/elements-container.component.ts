import {Component, ContentChild, HostBinding, Input, TemplateRef} from "@angular/core";
import {CommonStaticService} from "@hospital/shared-module";

@Component({
  selector: 'elements-container',
  templateUrl: './elements-container.component.html',
  styleUrls: ['./elements-container.component.scss']
})
export class ElementsContainerComponent {
  @ContentChild(TemplateRef) template: TemplateRef<any>;

  public trackByFn = CommonStaticService.trackByFn;
  private readonly defaultClass = 'table-body-elements';

  @HostBinding('class')
  get classVal(): string {
    let addClass = '';
    if (this.model.viewSettings) {
      addClass = 'view-settings';
    } else if (this.model.viewFilters) {
      addClass = 'view-filters';
    }
    return this.defaultClass + ' ' + addClass;
  }

  @Input()
  cellIsDefault: boolean = true;

  get columns(): any[] {
    return this.model?.columns || [];
  }

  @Input()
  model: any;

  constructor() {
  }

  public rowClick(elem: any): void {
    this.model.rowClick.emit(elem);
  }

  public columnClick(elem: any): void {
    this.model.columnClick.emit(elem);
  }
}
