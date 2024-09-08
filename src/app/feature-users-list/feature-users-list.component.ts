import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { UserFormComponent } from './user-form/user-form.component';
import { UserFormService } from './user-form.service';
import { FormGroup, FormsModule } from '@angular/forms';
import { merge, timer, takeUntil, switchMap, Subject, of } from 'rxjs';
import { UserApiService } from '../shared/api/user/user-api.service';
import { IUserForm } from '../shared/models/user-form.interface';
import { toSignal } from '@angular/core/rxjs-interop';

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

  private static readonly INITIAL_TIMER = 5;

  private countdown = signal(UserListComponent.INITIAL_TIMER);
  private usersAmount = toSignal(this.userFormService.usersAmount$);

  protected isTimerVisible = signal(false);
  protected countdownMessage = computed(() => `0:0${this.countdown()}`);
  protected isAddButtonDisabled = computed(() => Number(this.usersAmount()) === 10 || this.isTimerVisible());

  private readonly cancel$ = new Subject<void>();
  private readonly destroy$ = new Subject<void>();

  protected get invalidFormsMessage(): string | null {
    const amount = this.userFormService.invalidControlsAmount;

    return amount ? `Invalid forms: ${amount}` : null;
  }

  protected readonly trackByInternalId = (index: number, userForm: FormGroup<IUserForm>): string => {
    return userForm.getRawValue().internalId;
  };

  protected submit(): void {
    if (!this.userFormService.userFromList.valid) {
      this.userFormService.userFromList.markAllAsTouched();
      this.userFormService.triggerValidation();

      return;
    }

    this.isTimerVisible.set(true);
    this.fireDelayedRequest();
  }

  // Cancel timer subscription and refresh countdown.
  protected cancelRequest(): void {
    this.cancel$.next();
    this.countdown.set(UserListComponent.INITIAL_TIMER);
    this.isTimerVisible.set(false);
  }

  // Runs Timer and fire request after 5000 ms.
  private fireDelayedRequest(): void {
    const stop$ = merge(this.cancel$, this.destroy$);

    timer(0, 1_000).pipe(
      switchMap((tick) => {
        this.countdown.set(UserListComponent.INITIAL_TIMER - tick);

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
        this.cancelRequest();
      }
    });
  }
}
