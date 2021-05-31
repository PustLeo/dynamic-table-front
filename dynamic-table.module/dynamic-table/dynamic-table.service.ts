import {Injectable} from "@angular/core";
import {DynamicTableModel} from "./dynamic-table.model";
import {MetaStorageService} from "@utils/sockets/meta-storage/meta-storage.service";
import {forkJoin, from, of} from "rxjs";
import {concatMap, delay, tap} from "rxjs/operators";
import {TableNamesEnum} from "@utils/sockets/meta-storage/table-columns/table-names.enum";
import {FormControl, FormGroup} from "@angular/forms";

@Injectable()
export class DynamicTableService {

  public model: DynamicTableModel = new DynamicTableModel();

  constructor(private metaStorage: MetaStorageService) {
  }

  public init(tableName: TableNamesEnum): void {
    if (!tableName) {
      return;
    }
    this.model.tableName = tableName;
    this.loadData();
  }

  private loadData(): void {
    const tableName = this.model.tableName;
    forkJoin([
      this.metaStorage.getTableColumns(tableName),
      this.metaStorage.getTableFilters(tableName),
      this.metaStorage.getTableSort(tableName)
    ])
      .pipe(
        tap(([columns, filters, sort]) => {
          this.loadColumnsHandler(columns);
          this.loadFiltersHandler(filters);
          this.loadSortHandler(sort);
          this.setRequestBody();
        }),
      )
      .subscribe();
  }

  private loadColumnsHandler(columns: any): void {
    Object.entries(columns)
      .forEach(([key, val]: any) => this.setColumn(key, val));
    const colsSize = this.model.flexSize * this.model.baseColSize;
    const table = this.model.tableContainer?.nativeElement;
    const { width } = table?.getBoundingClientRect() ?? { width: colsSize };
    if (width > colsSize) {
      let countCol = 0;
      Object.entries(columns)
        .forEach(([key, col]: any) => col.view ? countCol += 1 : null);
      const baseColSize = width / countCol;
      if (baseColSize * this.model.flexSize < width) {
        this.model.baseColSize = width / this.model.flexSize;
      } else {
        this.model.baseColSize = baseColSize;
      }
    }
  }

  private setColumn(key: string, column: any): void {
    if (column.view) {
      this.model.flexSize += column.flexFactor;
    }
    this.model.columns.push({ key, ...column });
  }

  private loadFiltersHandler(filters: any): void {
    this.model.viewFilters = !!Object.keys(filters).length;
    const filtersForm = this.model.filters;
    console.log(Object.entries(filters));
    Object.entries(filters)
      .forEach(([key, val]: any) => filtersForm.addControl(key, new FormGroup({
        value: new FormControl(val.value),
        operator: new FormControl(val.operator),
        operatorIsExist: new FormControl(val.operatorIsExist),
        type: new FormGroup({
          type: new FormControl(val.type.type),
          subType: new FormControl(val.type.subType)
        })
      })));
    this.checkChangeFilters();
  }
  private loadSortHandler({ sortField, sortDir }): void {
    const sort = this.model.sort;
    sort.sortField = sortField;
    sort.sortDir = sortDir;
  }

  public setItems(items: any[], clear: boolean = false): void {
    const itemsInit = this.model.itemsInit;
    if (itemsInit && !itemsInit.closed) {
      itemsInit.unsubscribe();
    }
    if (clear) {
      this.model.list.splice(0);
    }
    this.model.itemsInit = from(items)
      .pipe(
        concatMap((item: any) => of(item).pipe(delay(10))),
        tap((item: any) => this.model.list.push(item))
      )
      .subscribe();
  }

  private setRequestBody(): void {
    const columns = this.model.columns
      .map(({ key, ...col }) => ({ id: key, title: col.title }));
    const filters = this.filtersMapToRequest();
    const sort = this.model.sort;
    this.model.toRequestBody.emit({ columns, filters, sort });
  }

  public eventScroll(event: any): void {
    if (event.target.offsetHeight + event.target.scrollTop + 50 >= event.target.scrollHeight) {
      this.model.scrollEnded.emit();
    }
  }

  private checkChangeFilters(): void {
    if (this.model.filtersChecker && !this.model.filtersChecker.closed) {
      this.model.filtersChecker.unsubscribe();
    }
    this.model.filtersChecker = this.model.filters
      .valueChanges
      .subscribe((data: any) => this.filtersValueChangeHandler(data));
  }

  private filtersValueChangeHandler(data: any): void {
    this.metaStorage.setTableFilters(this.model.tableName, data);
    this.setRequestBody();
  }

  private filtersMapToRequest(): any[] {
    const value = this.model.filters.value;
    const result = [];
    Object.entries(value)
      .forEach((elem: any) => this.returnFilterValue(elem, result));
    return result;
  }

  private returnFilterValue([key, val], result: any[]): void {
    const data: any = {};
    data.id = key;
    data.value = val.value;
    if (!data.value) {
      return;
    }
    if (val.operatorIsExist) {
      data.operator = val.operator;
    }
    result.push(data);
  }

  public saveChangeColumn({ key, ...col}): void {
    this.metaStorage.setTableColumn(this.model.tableName, { [key]: col });
  }

  public setSort(sortKey: string): void {
    const sort = this.model.sort;
    if (sort.sortField === sortKey) {
      if (sort.sortDir === 'asc') {
        sort.sortDir = 'desc';
      } else {
        sort.sortField = '';
      }
    } else {
      sort.sortField = sortKey;
      sort.sortDir = 'asc';
    }
    this.metaStorage.setTableSort(this.model.tableName, sort.sortField, sort.sortDir);
    this.setRequestBody();
  }
}
