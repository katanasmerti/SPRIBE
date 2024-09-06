import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Country } from '../../shared/models/country';
import { ValidationMessageDirective } from '../../shared/directives/validation-message.directive';
import { IUserForm } from '../../shared/models/user-form.interface';
import { buildDateRange } from '../../shared/utils/build-date-range.function';
import { dateValidator } from '../../shared/utils/date-validator.function';

@Component({
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, NgTemplateOutlet, ValidationMessageDirective],
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UserFormComponent),
      multi: true
    },
  ],
})
export class UserFormComponent implements OnInit, OnDestroy, ControlValueAccessor  {
  @Input({required: true})
  public userNumber!: number;

  @Output()
  public closeForm = new EventEmitter<number>();

  @ViewChild('#dateInput')
  public readonly dateInput?: HTMLInputElement;

  private readonly fb = inject(FormBuilder);

  protected readonly dateRange = buildDateRange();

  protected readonly internalForm = this.fb.group<IUserForm>({
    birthday: new FormControl<Date | null>(null, [Validators.required, dateValidator(this.dateRange.min, this.dateRange.max)]),
    country: new FormControl<Country | null>(null, Validators.required),
    userName: new FormControl<string | null>(null, [Validators.required, Validators.minLength(3)]),
  });

  // Control Value Accessor implementation.
  public registerOnChange(fn: any): void {}
  public registerOnTouched(fn: any): void {}
  public writeValue(value: any): void {
    if (value) {
      this.internalForm.patchValue(value, { emitEvent: false });
    }
  }

  private readonly destroy$ = new Subject<void>();

  protected readonly options: Country[] = Object.values(Country);
  protected filteredOptions: string[] = [];
  protected isOptionVisible = false;

  public ngOnInit(): void {
    this.internalForm.controls.birthday.valueChanges.pipe().subscribe(() => {
      console.log(this.internalForm);

      console.log(this.internalForm.controls.country.touched);
      console.log(this.internalForm.controls.country.valid);
    });

    this.internalForm.controls.country.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        this.filteredOptions = this.options.filter(option =>
          option.toLowerCase().includes(value.toLowerCase())
        );
      } else {
        this.filteredOptions = [];
      }

      this.isOptionVisible = this.filteredOptions.length > 0;
    });
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected onClose(): void {
    this.closeForm.emit(this.userNumber);
  }
}
