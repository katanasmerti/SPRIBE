import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckUserResponseData } from '../shared/interface/responses';
import { UserFormComponent } from './user-form/user-form.component';

@Component({
  standalone: true,
  imports: [NgFor, NgIf, UserFormComponent],
  selector: 'feature-users-list',
  templateUrl: './feature-users-list.component.html',
  styleUrls: ['./feature-users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  constructor(private http: HttpClient) {
  }


  // just an example, you are free to move it anywhere
  checkUser(username: string): Observable<CheckUserResponseData> {
    return this.http.post<CheckUserResponseData>('/api/checkUsername1', {username});
  }
}
