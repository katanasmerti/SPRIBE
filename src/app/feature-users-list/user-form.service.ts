import { inject, Injectable } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country } from '../shared/models/country';
import { IUserForm } from '../shared/models/user-form.interface';
import { catchError, debounceTime, first, map, of, Subject, switchMap } from 'rxjs';
import { dateValidator } from '../shared/utils/date-validator.function';
import { buildDateRange } from '../shared/utils/build-date-range.function';
import { countryValidator } from '../shared/utils/country-validator.function';
import { UserApiService } from '../shared/api/user/user-api.service';

@Injectable({
  providedIn: 'root'
})
export class UserFormService {
  private readonly fb = inject(FormBuilder);
  private readonly userApiService = inject(UserApiService);

  public readonly usernameValidator: AsyncValidatorFn = control =>
    of(control.value).pipe(
      debounceTime(300),
      switchMap(value => this.userApiService.checkUser(value)),
      first(),
      map(({ isAvailable }) => isAvailable ? null : { invalidUsername: { value: control.value } }),
      catchError(() => of({ invalidUsername: { value: control.value } }))
    );

  public readonly dateRange = buildDateRange();
  public readonly userFromList = this.fb.array([this.createUserForm()]);

  public get invalidControlsAmount(): number {
    const groups = this.userFromList.controls;
    const invalidGroups = groups.filter((group) => {
      return Object.keys(group.controls).some((key) => {
        const control = group.controls[key as keyof IUserForm];

        return control.invalid && control.touched;
      });
    });

    return invalidGroups.length;
   }

  public addUserForm(): void {
    this.userFromList.push(this.createUserForm());
  }

  public removeUserForm(index: number): void {
    this.userFromList.removeAt(index);
  }

  private triggerFormsValidation$ = new Subject<void>();

  public validationTriggered$ = this.triggerFormsValidation$.asObservable();

  public triggerValidation(): void {
    this.triggerFormsValidation$.next();
  }

  public createUserForm(): FormGroup<IUserForm> {
    return this.fb.group<IUserForm>({
      birthday: this.fb.control<Date | null>(null, {validators: [Validators.required, dateValidator(this.dateRange.min, this.dateRange.max)]}),
      userName: this.fb.control<string | null>(null, {validators: [Validators.required], asyncValidators: [this.usernameValidator]}),
      country: this.fb.control<Country | null>(null, {validators: [Validators.required, countryValidator()]}),
      internalId: this.fb.nonNullable.control(Date.now().toString()),
    });
  }

  public resetForm(): void {
    this.userFromList.clear();
    this.addUserForm();
  }
}
