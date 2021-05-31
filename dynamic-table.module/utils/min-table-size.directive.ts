import {Directive, ElementRef, HostBinding, HostListener, Input} from "@angular/core";

@Directive({selector: '[minTableSize]'})
export class MinTableSizeDirective {

  private readonly BASE_SIZE = 150;
  private minWidth: number = 0;
  private baseSizeVal: number = this.BASE_SIZE;

  @Input()
  set elemCount(count: number) {
    this.minWidth = count * this.baseSizeVal;
  }

  @Input()
  set baseSize(val: number) {
    this.baseSizeVal = val ?? this.BASE_SIZE;
  }

  @HostBinding('style.min-width')
  get setMinWidth() {
    return `${this.minWidth}px`;
  }

  constructor(protected element: ElementRef) {}
}
