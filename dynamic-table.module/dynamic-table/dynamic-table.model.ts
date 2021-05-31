import {ElementRef, EventEmitter} from "@angular/core";
import {TableNamesEnum} from "@utils/sockets/meta-storage/table-columns/table-names.enum";
import {Subscription} from "rxjs";
import {FormGroup} from "@angular/forms";

export class DynamicTableModel {
  tableName: TableNamesEnum;
  changeEnd: EventEmitter<any> = new EventEmitter<any>();
  toRequestBody: EventEmitter<any> = new EventEmitter<any>();
  scrollEnded: EventEmitter<any> = new EventEmitter<any>();
  rowClick: EventEmitter<any> = new EventEmitter<any>();
  columnClick: EventEmitter<any> = new EventEmitter<any>();
  tableContainer: ElementRef;
  selected: any = null;
  flexSize: number = 0;
  viewSettings: boolean = false;
  viewFilters: boolean = true;
  columns: any[] = [];
  filters: FormGroup = new FormGroup({});
  itemsInit: Subscription;
  filtersChecker: Subscription;
  list: any[] = [];
  baseColSize = 150;
  sort: any = {
    sortField: '',
    sortDir: 'asc'
  };
}
