import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { EMPTY, iif, Observable } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";
import { AsyncItem, AsyncItemState, makeAsyncItem } from "src/app/models/async-item";
import { Contact } from "src/app/services/contacts/contacts";
import { ContactsService } from "src/app/services/contacts/contacts.service";

export interface ContactsState {
  contacts: AsyncItem<Contact[]>;
  search: string;
}

@Injectable()
export class ContactsStore extends ComponentStore<ContactsState> {

  constructor(private contactService: ContactsService) {
    super({contacts: makeAsyncItem<Contact[]>(AsyncItemState.Uninitialized, []), search: ''});
  }

  readonly contacts$: Observable<AsyncItem<Contact[]>> = this.select(state => {
    if (state.contacts.state === AsyncItemState.Uninitialized) {
      this.load();
      return makeAsyncItem<Contact[]>(AsyncItemState.Loading, []);
    }

    if (state.contacts.state !== AsyncItemState.Loaded) {
      return state.contacts;
    }
    return makeAsyncItem<Contact[]>(AsyncItemState.Loaded, state.contacts.data!.filter(contact => {
      return contact.name?.toLowerCase().search(state.search.toLowerCase()) !== -1 || contact.phone?.toLowerCase().search(state.search.toLowerCase()) !== -1;
    }));
  });

  readonly load = this.effect((asd: Observable<void>) => {
    return asd.pipe(
      switchMap(() => this.contactService.getContacts().pipe(
        tap((contacts) => this.setContacts(contacts)),
        catchError(() => EMPTY),
      ))
    );
  });

  readonly removeContact = this.effect((contactIds$: Observable<number>) => {
    return contactIds$.pipe(
      switchMap((id) => this.contactService.deleteContact(id).pipe(
        tap(() => this.removeContactFromStore(id)),
        catchError(() => EMPTY),
      )),
    )
  });

  readonly editContact = this.effect((editContacts$: Observable<Contact>) => {
    return editContacts$.pipe(
      switchMap((editedContact) => iif(() => editedContact.id < 0,
        this.contactService.addContacts(editedContact).pipe(
          tap(console.log),
          tap(newContact => this.editContactInStore({ id: editedContact.id, newContact: newContact! })),
          catchError(() => EMPTY)
        ),
        this.contactService.editContact(editedContact).pipe(
          tap((newContact) => this.editContactInStore({ id: editedContact.id, newContact: newContact! })),
          catchError(() => EMPTY),
        )
      )),
    )
  });

  readonly updateSearch = this.updater((state, search: string) => ({ ...state, search }));
  readonly addContactToStore = this.updater((state, newContact: Contact) => ({ ...state, contacts: makeAsyncItem(AsyncItemState.Loaded, [newContact].concat(state.contacts.data!)) }));

  private readonly setContacts = this.updater((state, contacts: AsyncItem<Contact[]>) => ({ ...state, contacts }));
  private readonly removeContactFromStore = this.updater((state, id: number) => ({ ...state, contacts: makeAsyncItem(AsyncItemState.Loaded, state.contacts.data!.filter(contact => contact.id !== id)) }));
  private readonly editContactInStore = this.updater((state, { newContact, id } : { newContact: Contact; id: number }) => ({ ...state, contacts: makeAsyncItem(AsyncItemState.Loaded, this.substituteContact(state.contacts.data!, id, newContact)) }));

  private substituteContact(contacts: Contact[], id: number, newContact: Contact): Contact[] {
    const contactIndex = contacts.findIndex(contact => contact.id === id);
    if (contactIndex === -1) {
      throw new Error(`Could not find an element: ${JSON.stringify(newContact)}`);
    }
    const result = contacts.slice();

    result.splice(contactIndex, 1, newContact);
    return result;
  }
}
