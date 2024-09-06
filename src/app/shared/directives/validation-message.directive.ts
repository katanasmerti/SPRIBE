import { Directive, Input, ElementRef, Renderer2, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  standalone: true,
  selector: '[appValidationMessage]'
})
export class ValidationMessageDirective implements OnInit {
  @Input('appValidationMessage') errorMessage: string = '';

  private errorElement: HTMLElement;

  constructor(private el: ElementRef, private control: NgControl, private renderer: Renderer2) {
    this.errorElement = this.renderer.createElement('div');
  }

  ngOnInit(): void {
    this.renderer.setStyle(this.errorElement, 'position', 'absolute');
    this.renderer.setStyle(this.errorElement, 'color', 'red');
    this.renderer.setStyle(this.errorElement, 'fontSize', '12px');

    this.renderer.appendChild(this.el.nativeElement.parentNode, this.errorElement);

    // this.control.

    this.control.statusChanges?.subscribe(status => {
      console.log(status);

      if (status === 'INVALID' && this.control.errors) {
        this.showError();
      } else {
        this.hideError();
      }
    });
  }

  private showError() {
    this.errorElement.textContent = this.errorMessage;
    this.renderer.setStyle(this.errorElement, 'padding-top', '3px');
    this.renderer.setStyle(this.errorElement, 'display', 'block');
  }

  private hideError() {
    this.errorElement.textContent = '';
    this.renderer.setStyle(this.errorElement, 'display', 'none');
  }
}
