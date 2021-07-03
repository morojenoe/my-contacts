import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ConventionalResponse } from 'src/app/models/conventional-response';
import { Contact } from './contacts';
import { delay } from 'rxjs/operators';

@Injectable()
export class MockContactsInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('/contacts/delete')) {
      return of(new HttpResponse({ body: { data: null, errors: null } })).pipe(delay(0));
    }

    if (request.url.includes('/contacts/edit')) {
      return of(new HttpResponse({ body: { data: request.body, errors: null } })).pipe(delay(0));
    }

    if (request.url.includes('/contacts/add')) {
      return of(new HttpResponse({ body: { data: { ...(request.body as { contact: Contact })?.contact, id: Math.floor(Math.random() * 1000) }, errors: null } })).pipe(delay(0));
    }
  
    if (request.url.includes('/contacts')) {
      return of(new HttpResponse({ body: this.contacts() })).pipe(delay(2000));
    }
  
    return next.handle(request);
  }

  private contacts(): ConventionalResponse<Contact[]> {
    return {
      data: [
        { id: 1, name: 'John', phone: '+7964123456' },
        { id: 2, name: 'Ivan', phone: '+7964123456' },
        { id: 3, name: 'Oleg', phone: '+7964123456' }
      ],
      errors: null
    }
  }
}
