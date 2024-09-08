import { Directive, Input, ElementRef, Renderer2, OnInit, OnDestroy, inject, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  standalone: true,
  selector: '[appValidationMessage]',
})
export class ValidationMessageDirective implements OnInit, OnDestroy {
  @HostListener('blur', ['$event'])
  onBlur(): void {
    this.updateErrorMessage();
  }

  @Input('appValidationMessage')
  public errorMessage!: string;

  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly control = inject(NgControl);

  private readonly errorElement: HTMLElement = this.initErrorMessage();

  private readonly destroy$ = new Subject<void>();

  public ngOnInit(): void {
    this.control.statusChanges?.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateErrorMessage();
    });
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateErrorMessage(): void {
    const control = this.control.control;

    // Show error message and mark input element with error class name.
    if (control && control.invalid && (control.dirty || control.touched)) {
      this.renderer.setProperty(this.errorElement, 'textContent', this.errorMessage);
      this.renderer.addClass(this.elementRef.nativeElement, 'is-invalid');
      this.renderer.appendChild(this.elementRef.nativeElement.parentNode, this.errorElement);

      return;
    }

    // Hide error message and remove input element error class name.
    if (this.errorElement.parentNode) {
      this.renderer.removeChild(this.elementRef.nativeElement.parentNode, this.errorElement);
      this.renderer.removeClass(this.elementRef.nativeElement, 'is-invalid');
    }
  }

  // Generate empty error message container.
  private initErrorMessage(): HTMLDivElement {
    const errorElement = this.renderer.createElement('div');
    this.renderer.setStyle(errorElement, 'color', 'red');
    this.renderer.setStyle(errorElement, 'fontSize', '12px');
    this.renderer.setStyle(errorElement, 'marginTop', '3px');
    this.renderer.setStyle(errorElement, 'position', 'absolute');

    return errorElement;
  }
}
