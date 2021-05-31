import {Component, EventEmitter, HostBinding, HostListener, Input, Output} from "@angular/core";
import {CommonStaticService} from "@hospital/shared-module";

@Component({
  selector: 'settings-row',
  templateUrl: './settings-row.component.html',
  styleUrls: ['./settings-row.component.scss']
})
export class SettingsRowComponent {

  public trackByFn = CommonStaticService.trackByFn;

  @HostBinding('class')
  get view() {
    return this.model.viewSettings ? 'view' : '';
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

  @HostListener('mousemove', ['$event'])
  mousemove(event: any) {
    if (this.model.selected) {
      const oldFlexFactor = this.model.selected.item.flexFactor;
      const colSize = event.clientX - this.model.selected.container.x;
      let tempFlexFactor = colSize / 150;
      if (tempFlexFactor < 0.5) {
        tempFlexFactor = 0.5;
      } else if (tempFlexFactor > 5) {
        tempFlexFactor = 5;
      }
      this.model.selected.item.flexFactor = tempFlexFactor;
      this.model.columnCount += this.model.selected.item.flexFactor - oldFlexFactor;
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
