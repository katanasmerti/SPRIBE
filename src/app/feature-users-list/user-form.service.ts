import { inject, Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from '../shared/models/country';
import { IUserForm } from '../shared/models/user-form.interface';
import { IUser } from '../shared/models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserFormService {
  private readonly fb = inject(FormBuilder);

  public readonly usersList = this.fb.array<FormGroup<IUserForm>>([this.createUserForm()]);

  public readonly usersForm = this.fb.group({
    usersList: this.usersList,
  });

  public addForm(): void {
    this.usersList.push(this.createUserForm());
  }

  public removeForm(index: number): void {
    this.usersList.removeAt(index);
  }

  public getUsersList(): IUser[] {
    return this.usersList.getRawValue() as IUser[];
  }

  public isFormArrayValid(formArray: FormArray): boolean {
    return formArray.valid;
  }

  private createUserForm(): FormGroup<IUserForm> {
    return this.fb.group<IUserForm>({
      country: new FormControl<Country | null>(null, Validators.required),
      userName: new FormControl<string | null>('asdasd', [Validators.required, Validators.minLength(3)]),
      birthday: new FormControl<Date | null>(null, Validators.required)
    });
  }
}
