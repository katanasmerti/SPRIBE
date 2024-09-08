import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Country } from '../../shared/models/country.enum';
import { ValidationMessageDirective } from '../../shared/directives/validation-message.directive';
import { UserFormService } from '../user-form.service';
import { IUserForm } from '../../shared/models/user-form.interface';

@Component({
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, NgTemplateOutlet, ValidationMessageDirective],
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent implements OnInit {
  @Input({required: true})
  public userIndex!: number;

  @Input({required: true})
  public userForm!: FormGroup<IUserForm>;

  @Input()
  public isDisabled = false;

  protected readonly userFormService = inject(UserFormService);

  private readonly destroy$ = new Subject<void>();

  protected readonly options: Country[] = Object.values(Country);

  protected filteredOptions: string[] = [];
  protected isOptionVisible = false;

  public ngOnInit(): void {
    this.initValidationTriggerSubscription();
    this.initCountryValueChangedSubscription();
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected onClose(): void {
    this.userFormService.removeUserForm(this.userIndex);
  }

  // Update value and validity for each control inside group after form submit event triggered.
  private initValidationTriggerSubscription(): void {
    this.userFormService.validationTriggered$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      Object.keys(this.userForm.controls).forEach((key) => {
        this.userForm.controls[key as keyof IUserForm].updateValueAndValidity();
      });
    });
  }

  // Handle country control value change to build autosuggest options list.
  private initCountryValueChangedSubscription(): void {
    this.userForm.controls.country.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
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
}
