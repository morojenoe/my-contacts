import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConventionalResponse } from 'src/app/models/conventional-response';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: User | null = null;

  constructor(private httpClient: HttpClient) { }

  get currentUser(): User | null {
    return this.user;
  }

  isLoggedIn(): boolean {
    return this.user !== null;
  }

  login(username: string, password: string): Observable<ConventionalResponse<User>> {
    if (this.user) {
      return of({ data: this.user, errors: null});
    }

    return this.httpClient.post<ConventionalResponse<User>>('https://backend.com/auth', { username, password }).pipe(
      tap(user => {
        if (user.errors) {
          throw user.errors;
        }
      }),
      tap(user => this.user = user.data),
    );
  }
}
