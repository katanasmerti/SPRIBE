import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckUserResponseData } from '../shared/models/responses';
import { UserFormComponent } from './user-form/user-form.component';
import { UserFormService } from './user-form.service';
import { FormsModule } from '@angular/forms';
import { IUser } from '../shared/models/user.interface';
import { UserFactory } from '../shared/utils/user-factory.class';

@Component({
  standalone: true,
  imports: [NgFor, NgIf, UserFormComponent, FormsModule],
  selector: 'feature-users-list',
  templateUrl: './feature-users-list.component.html',
  styleUrls: ['./feature-users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  private readonly http = inject(HttpClient);
  protected readonly userFormService = inject(UserFormService);

  protected usersList: IUser[] = [UserFactory.createUser()];

  protected addUser(): void {
    this.usersList.push(UserFactory.createUser());
  }

  protected submit(): void {
    console.log(this.userFormService.getUsersList());
  }

  protected onCloseForm(index: number): void {
    this.usersList = this.usersList.filter((user, i) => i !== index);
  }

  private checkUser(username: string): Observable<CheckUserResponseData> {
    return this.http.post<CheckUserResponseData>('/api/checkUsername1', {username});
  }
}
