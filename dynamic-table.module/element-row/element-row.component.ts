import {AfterContentInit, AfterViewInit, Component, ContentChild, ContentChildren, EventEmitter, HostBinding, Input, Output, TemplateRef, ViewChild, ViewChildren, ViewContainerRef} from "@angular/core";
import {CommonStaticService} from "@hospital/shared-module";

@Component({
  selector: 'element-row',
  templateUrl: './element-row.component.html',
  styleUrls: ['./element-row.component.scss']
})
export class ElementRowComponent implements AfterViewInit, AfterContentInit {
  @ContentChild(TemplateRef) template: TemplateRef<any>;

  public trackByFn = CommonStaticService.trackByFn;

  @HostBinding('class')
  readonly classVal: string = 'table-element';

  @Input()
  baseColSize: number;

  @Input()
  content: any;

  @Input()
  columns: any[] = [];

  @Input()
  cellIsDefault: boolean = true;

  @Output()
  columnClick: EventEmitter<any> = new EventEmitter<any>();

  ngAfterViewInit(): void {
  }

  ngAfterContentInit(): void {
  }
}
