import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input'; 
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button'; 
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { MatIconModule } from '@angular/material/icon'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockAuthInterceptor } from './services/auth/mock-auth.interceptor';
import { ContactComponent } from './components/contact/contact.component';
import { MockContactsInterceptor } from './services/contacts/mock-contacts.interceptor';
import { SearchBarComponent } from './components/search-bar/search-bar.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ContactsComponent,
    ContactComponent,
    SearchBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MockAuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MockContactsInterceptor,
      multi: true
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
