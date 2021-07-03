import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { ContactsStore } from '../contacts/contacts.store';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  search = new FormControl('');
  private subscription = new Subscription();

  constructor(private contactsStore: ContactsStore) { }

  ngOnInit(): void {
    this.subscription = this.search.valueChanges.pipe(
      distinctUntilChanged(),
      tap((value) => this.contactsStore.updateSearch(value))
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addContact() {
    this.contactsStore.addContactToStore({ name: '', phone: '', id: -Math.floor(Math.random() * 1000000000) });
  }
}
