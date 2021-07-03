import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../../models/user';
import { delay } from 'rxjs/operators';
import { LoginError } from './errors';
import { ConventionalResponse } from '../../models/conventional-response';

@Injectable()
export class MockAuthInterceptor implements HttpInterceptor {
  readonly registeredUsers = [
    { username: 'test', password: 'test', id: 1 },
    { username: 'batman', password: 'robin', id: 2 }
  ];

  readonly userInfo: User[] = [
    {
      id: 1,
      username: 'test',
      firstName: 'Ivan',
      lastName: 'Petrov'
    },
    {
      id: 2,
      username: 'test',
      firstName: 'Batman',
      lastName: 'Robinov'
    },
  ];

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('/auth')) {
      return of(new HttpResponse({ body: this.checkUser(request.body as { username: string; password: string }) })).pipe(delay(2000));
    }

    return next.handle(request);
  }

  checkUser(credentials: { username: string; password: string }): ConventionalResponse<User | LoginError[]> {
    const user = this.registeredUsers.find(user => user.username === credentials?.username && user.password === credentials?.password);
    if (user) {
      return {
        data: this.userInfo.find(info => info.id === user.id)!,
        errors: null
      }
    }
    return this.errors();
  }

  private errors(): ConventionalResponse<LoginError[]> {
    return {
      data: null,
      errors: [{
        errorCode: 'wrong'
      }]
    };
  }
}
