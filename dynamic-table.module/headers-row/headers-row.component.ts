import {Component, EventEmitter, HostBinding, HostListener, Input, Output} from "@angular/core";
import {CommonStaticService} from "@hospital/shared-module";

@Component({
  selector: 'headers-row',
  templateUrl: './headers-row.component.html',
  styleUrls: ['./headers-row.component.scss']
})
export class HeadersRowComponent {

  public trackByFn = CommonStaticService.trackByFn;

  @HostBinding('class')
  readonly classVal: string = 'table-body-header';

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

  @HostListener('mousemove', ['$event'])
  mousemove(event: any) {
    if (this.model.selected) {
      const oldFlexFactor = this.model.selected.item.flexFactor;
      const colSize = event.clientX - this.model.selected.container.x;
      let tempFlexFactor = colSize / this.model.baseColSize;
      if (tempFlexFactor < 0.5) {
        tempFlexFactor = 0.5;
      } else if (tempFlexFactor > 5) {
        tempFlexFactor = 5;
      }
      this.model.selected.item.flexFactor = tempFlexFactor;
      this.model.flexSize += this.model.selected.item.flexFactor - oldFlexFactor;
    }
  }

  mousedown(target: HTMLElement, item: any) {
    const container = target.getBoundingClientRect();
    this.model.selected = { container };
    this.model.selected.item = item;
  }

  @HostListener('mouseup', ['$event'])
  mouseup(event: any) {
    if (this.model.selected) {
      const { item } = this.model.selected;
      this.changeColumn.emit(item);
    }
    this.model.selected = null;
  }
}
