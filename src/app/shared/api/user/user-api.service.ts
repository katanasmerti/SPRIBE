import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { IUser } from "../../models/user.interface";
import { CheckUserResponseData } from "../../models/check-user-response-data.interface";
import { SubmitFormResponseData } from "../../models/submit-form-response-data.interface";

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private readonly http = inject(HttpClient);

  public checkUser(username: string): Observable<CheckUserResponseData> {
    return this.http.post<CheckUserResponseData>('/api/checkUsername', {username});
  }

  public createUsers(users: IUser[]): Observable<SubmitFormResponseData> {
    return this.http.post<SubmitFormResponseData>('/api/submitForm', {users});
  }
}
