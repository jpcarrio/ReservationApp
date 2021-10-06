import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contacts } from '../../../models/contacts';
import { ContactTypes } from 'src/app/models/contactTypes';
import { ContactReservation } from 'src/app/models/contactReservation';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable, OperatorFunction} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-reservation-add',
  templateUrl: './reservation-add.component.html',
  styleUrls: ['./reservation-add.component.css']
})
export class ReservationAddComponent implements OnInit {
    
   //Set Title Page
  title: string = 'Create Reservation';

  constructor( private http: HttpClient, private router: Router, private _Activatedroute:ActivatedRoute) { }
  
  Items: string[] = [];
  list: Contacts[] = []; 

  isEditing : boolean = false;
 
  //This component is reused to Add and Edit Reservation
  //Set Values to store retrieved parameters

  cName: string = '';
  cType: Number = 0;
  cPhone: string = '';
  cBirthday: string = '';

  cid: Number = 0;
  rid: Number = 0;  
  rPlace: string='';
  rDate: string='';

  //List to get Contact Types
  typeList: ContactTypes[] = [];
  
  ngOnInit(): void {     

    //If the route match with edit a Reservation, it gets the parameters on URL
     //to detect if get something, then change the rest of parameters
    if (this._Activatedroute.snapshot.params["id"] > 0)     
     {       
      this.title= 'Edit Reservation';
      this.isEditing = true;

        this.rid = this._Activatedroute.snapshot.params["id"];
        this.cid = this._Activatedroute.snapshot.params["contactId"];
        this.rPlace = this._Activatedroute.snapshot.params["reservationPlace"];
        this.rDate = this._Activatedroute.snapshot.params["reservationDate"];        

        //Get the Contact Data from ContactID
        this.http
        .get<Contacts>('https://localhost:5001/api/Contacts/'+this.cid)    
        .subscribe(contacts => {
          this.cName = contacts.contactName;          
          this.cType = contacts.contactType;  
          this.cPhone = contacts.contactPhone;  
          this.cBirthday = formatDate(contacts.birthday, 'yyyy-MM-dd', 'en').substring(0,10);
        });

        //It need to format the Date, so the input (type=date) is able to get it
        this.rDate = formatDate(this.rDate, 'yyyy-MM-dd', 'en').substring(0,this.rDate.length-1);
     } 

     //To fill the Contact's Suggestion List
    this.http
    .get('https://localhost:5001/api/Contacts')    
    .subscribe(contacts => {      
      this.list = contacts as Contacts[];
      this.Items =[];
      for (const elem of this.list) {
        this.Items.push(elem.contactName);
      }
    });

    //On start retrieves Contact Types from database
    this.http
    .get('https://localhost:5001/api/ContactTypes')    
    .subscribe(contactTypes => {
      this.typeList = contactTypes as ContactTypes[];      
    });
         
  } 
  
  //While you typying it is going looking for Suggestions
  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.Items.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
    
    //When you select the autosuggested Name, It fills the rest Contact info from database    
    selectedItem(item: any){      
      this.http
        .get<Contacts>('https://localhost:5001/api/Contacts/'+item.item)    
        .subscribe(contacts => {
          
          this.cType = contacts.contactType;  
          this.cPhone = contacts.contactPhone;  
          this.cBirthday = formatDate(contacts.birthday, 'yyyy-MM-dd', 'en').substring(0,10);
        });
    }  

  onSubmit(form: NgForm) {
    //If ID is set then Update the Reservation, if not Add New Reservation
    if (this.rid > 0)
      this.updateReservation(form);
    else
      this.addReservation(form);
  }

  //POST to API to Create a Reservation
  addReservation(form: NgForm){   
    this.http
      .post<ContactReservation>('https://localhost:5001/api/Reservations', form.value)    
      .subscribe(responseData => {
        if (responseData != null){         
          this.router.navigate(['/']);
        } 
    });
  }

  //PUT to API to update a Reservation
  updateReservation(form: NgForm){
    this.http
      .put('https://localhost:5001/api/Reservations/' + form.value.Id, form.value)    
      .subscribe(responseData => { 
        if (responseData == null)       
          this.router.navigate(['/']);
    });
  }
}
