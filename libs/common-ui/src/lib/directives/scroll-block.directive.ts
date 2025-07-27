import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { debounceTime, fromEvent, Subscription } from 'rxjs';

@Directive({
  selector: '[scrollBlock]',
  standalone: true,
})
export class ScrollBlockDirective implements AfterViewInit, OnDestroy {
  r2 = inject(Renderer2);
  hostElement = inject(ElementRef);

  bottomPaddingSize = input<number>(1);
  diff = input<number>(0);

  resizeSubscription!: Subscription;

  ngAfterViewInit() {
    this.resizeFeed();
    this.r2.setStyle(this.hostElement.nativeElement, 'overflow-y', 'scroll');

    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => this.resizeFeed());
  }

  resizeFeed() {
    const { top } = (
      this.hostElement.nativeElement as HTMLElement
    ).getBoundingClientRect();

    const height =
      window.innerHeight - top - 24 * this.bottomPaddingSize() - this.diff();
    this.r2.setStyle(this.hostElement.nativeElement, 'height', height + 'px');
  }

  ngOnDestroy() {
    this.resizeSubscription.unsubscribe();
  }
}
