import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { AsyncItemState, makeAsyncItem } from 'src/app/models/async-item';
import { ConventionalResponse } from 'src/app/models/conventional-response';
import { AuthService } from '../auth/auth.service';
import { Contact } from './contacts';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  getContacts() {
    return this.httpClient.post<ConventionalResponse<Contact[]>>('https://backend.com/contacts', { id: this.authService.currentUser?.id }).pipe(
      map((response) => {
        if (response.errors) {
          throw response.errors;
        }
        return makeAsyncItem<Contact[]>(AsyncItemState.Loaded, response.data!);
      }),
      catchError(_errors => of(makeAsyncItem<Contact[]>(AsyncItemState.Error, []))),
      startWith({ state: AsyncItemState.Loading })
    );
  }

  addContacts(newContact: Contact) {
    return this.httpClient.post<ConventionalResponse<Contact>>('https://backend.com/contacts/add', { contact: newContact }).pipe(
      map((response) => {
        if (response.errors) {
          throw response.errors;
        }
        return response.data;
      }),
    );
  }

  deleteContact(id: number) {
    return this.httpClient.post<ConventionalResponse<void>>(`https://backend.com/contacts/delete/${id}`, {}).pipe(
      map((response) => {
        if (response.errors) {
          throw response.errors;
        }
        return response.data;
      }),
    );
  }

  editContact(contact: Contact) {
    return this.httpClient.post<ConventionalResponse<Contact>>(`https://backend.com/contacts/edit/${contact.id}`, { ...contact }).pipe(
      map((response) => {
        if (response.errors) {
          throw response.errors;
        }
        return response.data;
      }),
    );
  }
}
