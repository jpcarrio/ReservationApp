import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//To enable the Routes use
import { Routes, RouterModule } from '@angular/router';

//Datatables to List from Database
import {DataTablesModule} from 'angular-datatables';

//RichText Editor WYSIWYG
import { CKEditorModule } from 'ckeditor4-angular';

//Forms
import { FormsModule} from '@angular/forms';

//Http Request
import { HttpClientModule } from '@angular/common/http';

//Components
import { ReservationListComponent } from './components/reservations/list/reservation-list.component';
import { ReservationAddComponent } from './components/reservations/add/reservation-add.component';
import { ContactAddComponent } from './components/contacts/add/contact-add.component';
import { ContactListComponent } from './components/contacts/list/contact-list.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';

//Create the Path for Routes to navigate among pages
const appRoutes: Routes = [
  { path: '', component:ReservationListComponent }, 
  { path: 'reservation-add', component: ReservationAddComponent },
  { path: 'contact-add', component: ContactAddComponent},
  { path: 'contact-list', component: ContactListComponent},
  { path: 'contact-edit/:id/:contactName/:contactType/:contactPhone/:birthday', component: ContactAddComponent},
  { path: 'reservation-edit/:id/:contactId/:reservationPlace/:reservationDate', component: ReservationAddComponent}
  
];

@NgModule({
  declarations: [
    AppComponent,
    ReservationListComponent,
    ReservationAddComponent,
    ContactAddComponent,
    ContactListComponent  
  ],
  imports: [
    BrowserModule,
    DataTablesModule,
    CKEditorModule,
    FormsModule,    
    HttpClientModule,
    NgbModule,       
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],  
  bootstrap: [AppComponent]
})
export class AppModule { }
