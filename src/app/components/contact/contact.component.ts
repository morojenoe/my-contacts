import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Contact } from 'src/app/services/contacts/contacts';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  @Input() contact: Contact | null = null;

  @Output() edit = new EventEmitter<Contact>();
  @Output() remove = new EventEmitter<number>();

  form = new FormGroup({
    name: new FormControl(''),
    phone: new FormControl('')
  });

  isEditing = false;

  private get editedContact(): Contact {
    return {
      id: this.contact?.id!,
      name: this.form.controls.name.value,
      phone: this.form.controls.phone.value
    }
  }

  ngOnChanges(): void {
    this.form.controls.name.setValue(this.contact?.name);
    this.form.controls.phone.setValue(this.contact?.phone);
  }

  ngOnInit(): void {
    if ((this.contact?.id || 0) < 0) {
      this.isEditing = true;
    } else {
      this.isEditing = false;
      this.disable();
    }
  }

  editContact(): void {
    this.isEditing = true;
    this.enable();
  }

  saveContact(): void {
    this.disable();
    this.isEditing = false;
    this.edit.emit(this.editedContact);
  }

  removeContact(): void {
    this.remove.emit(this.contact?.id);
  }

  private enable(): void {
    this.form.controls.name.enable();
    this.form.controls.phone.enable();
  }

  private disable(): void {
    this.form.controls.name.disable();
    this.form.controls.phone.disable();
  }
}
