import { Component } from '@angular/core';
import { AsyncItemState } from 'src/app/models/async-item';
import { Contact } from 'src/app/services/contacts/contacts';
import { ContactsStore } from './contacts.store';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  providers: [ContactsStore],
})
export class ContactsComponent {
  AsyncItemState = AsyncItemState;
  contacts$ = this.contactsStore.contacts$;

  constructor(private contactsStore: ContactsStore) { }

  edit(contact: Contact): void {
    this.contactsStore.editContact(contact);
  }

  remove(id: number): void {
    this.contactsStore.removeContact(id);
  }
}
