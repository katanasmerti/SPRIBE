import { AbstractControl, ValidatorFn } from '@angular/forms';

export function dateValidator(minDate: string, maxDate: string): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const inputDate = new Date(value);
    const min = new Date(minDate);
    const max = new Date(maxDate);

    if (inputDate < min || inputDate > max) {
      return { dateRange: { minDate, maxDate } };
    }

    return null;
  };
}
