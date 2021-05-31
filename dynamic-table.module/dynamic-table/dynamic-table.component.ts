import {Component, ContentChild, ElementRef, EventEmitter, Input, Output, TemplateRef, ViewChild} from "@angular/core";
import {TableNamesEnum} from "@utils/sockets/meta-storage/table-columns/table-names.enum";
import {DynamicTableService} from "./dynamic-table.service";
import {DynamicTableModel} from "./dynamic-table.model";

@Component({
  selector: 'dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
  providers: [DynamicTableService]
})
export class DynamicTableComponent {
  @ContentChild(TemplateRef) template: TemplateRef<any>;
  public model: DynamicTableModel;

  @ViewChild('table', { static: true })
  set tableContainer(table: ElementRef) {
    this.model.tableContainer = table;
  }


  @Input()
  set tableName(val: TableNamesEnum) {
    this.service.init(val);
  }

  @Input()
  set toggleViewBlocks(val: boolean) {
    this.model.viewFilters = val;
    this.model.viewSettings = val;
  }

  @Input()
  cellIsDefault: boolean = true;

  @Input()
  set items(val: any[] | any) {
    if (val) {
      if (Array.isArray(val)) {
        this.service.setItems(val);
      } else {
        this.service.setItems(val.list, val.clear);
      }
    }
  }

  @Output()
  get changeEnd(): EventEmitter<any> {
    return this.model.changeEnd;
  }

  @Output()
  get toRequestBody(): EventEmitter<any> {
    return this.model.toRequestBody;
  }

  @Output()
  get scrollEnded(): EventEmitter<any> {
    return this.model.scrollEnded;
  }

  @Output()
  get rowClick(): EventEmitter<any> {
    return this.model.rowClick;
  }

  @Output()
  get columnClick(): EventEmitter<any> {
    return this.model.columnClick;
  }

  constructor(private service: DynamicTableService) {
    this.model = service.model;
  }

  public eventScroll(event: Event): void {
    this.service.eventScroll(event);
  }

  public saveChangeColumn(column: any): void {
    this.service.saveChangeColumn(column);
  }

  public setSort(sortKey: string): void {
    this.service.setSort(sortKey);
  }
}
