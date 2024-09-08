import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { UserFormComponent } from './user-form/user-form.component';
import { UserFormService } from './user-form.service';
import { FormGroup, FormsModule } from '@angular/forms';
import { merge, timer, takeUntil, switchMap, Subject, of } from 'rxjs';
import { UserApiService } from '../shared/api/user/user-api.service';
import { IUserForm } from '../shared/models/user-form.interface';

@Component({
  standalone: true,
  imports: [NgFor, NgIf, UserFormComponent, FormsModule],
  selector: 'feature-users-list',
  templateUrl: './feature-users-list.component.html',
  styleUrls: ['./feature-users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  private readonly userApiService = inject(UserApiService);
  protected readonly userFormService = inject(UserFormService);

  private countdown = signal(5);

  protected countdownMessage = computed(() => `0:0${this.countdown()}`);
  protected isTimerVisible = signal(false);

  private readonly cancel$ = new Subject<void>();
  private readonly destroy$ = new Subject<void>();

  protected get invalidFormsMessage(): string | null {
    const amount = this.userFormService.invalidControlsAmount;

    return amount ? `Invalid forms: ${amount}` : null;
  }

  protected readonly trackByInternalId = (index: number, userForm: FormGroup<IUserForm>): string => userForm.getRawValue().internalId;

  protected submit(): void {
    if (!this.userFormService.userFromList.valid) {
      this.userFormService.userFromList.markAllAsTouched();
      this.userFormService.triggerValidation();

      return;
    }

    this.isTimerVisible.set(true);
    this.fireDelayedRequest();
  }

  protected cancel(): void {
    this.cancel$.next();
    this.countdown.set(5);
    this.isTimerVisible.set(false);
  }

  private fireDelayedRequest(): void {
    const stop$ = merge(this.cancel$, this.destroy$);

    timer(0, 1000).pipe(
      switchMap((tick) => {
        this.countdown.set(5 - tick);

        if (!this.countdown()) {
          this.isTimerVisible.set(true);

          return this.userApiService.createUsers(this.userFormService.userFromList.getRawValue());
        }

        return of(null);
      }),
      takeUntil(stop$),
    ).subscribe((response) => {
      if (response?.result) {
        this.userFormService.resetForm();
        this.cancel();
      }
    });
  }
}
