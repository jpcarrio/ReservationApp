import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';

import { ContactTypes } from 'src/app/models/contactTypes';

//import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-contact-add',
  templateUrl: './contact-add.component.html',
  styleUrls: ['./contact-add.component.css']
})
export class ContactAddComponent implements OnInit {
  
  //Set Title Page
  title: string = 'Create a Contact';

  //This component is reused to Add and Edit Contact
  //Set Values to store retrieved parameters
  cid: Number = 0;
  cName: string ='';
  cType: Number = 0;
  cPhone: string ='';
  cBirthday: string='';
  
  //Inject HttpClient to get access to API, Router and Activatedroute to get the parameters in the route
  constructor(private http: HttpClient, private router: Router, private _Activatedroute:ActivatedRoute) { }

  //List to get Contact Types
  typeList: ContactTypes[] = [];

  ngOnInit(): void {

    //On start retrieves Contact Types from database
    this.http
    .get('https://localhost:5001/api/ContactTypes')    
    .subscribe(contactTypes => {
      this.typeList = contactTypes as ContactTypes[];      
    });

    //If the route match with edit a contact, it gets the parameters on URL
     //to detect if get something, then change title to Edit and get the rest of parameters
     if (this._Activatedroute.snapshot.params["id"] > 0)     
     {       
        this.title = 'Edit Contact';
        this.cid = this._Activatedroute.snapshot.params["id"]; 
        this.cName = this._Activatedroute.snapshot.params["contactName"];
        this.cType = this._Activatedroute.snapshot.params["contactType"];
        this.cPhone = this._Activatedroute.snapshot.params["contactPhone"];
        this.cBirthday = this._Activatedroute.snapshot.params["birthday"];
     
        //It need to format the Date, so the input (type=date) is able to get it
        this.cBirthday = formatDate(this.cBirthday, 'yyyy-MM-dd', 'en').substring(0,this.cBirthday.length-1);
     }
  }

  onSubmit(form: NgForm) {  

    //If ID is set then Update the Contact, if not Add New Contact
    if (this.cid > 0) 
      this.updateContact(form);   
    else
      this.addContact(form);           
  }
  
  //POST to API to add new Contact, 
  addContact(form: NgForm){
    this.http
      .post('https://localhost:5001/api/Contacts', form.value)    
      .subscribe(responseData => {
        console.log(responseData);
        if (responseData != null)       
          this.router.navigate(['/contact-list']);
    });
  }

  //PUT to API to update a Contact
  updateContact(form: NgForm){
    this.http
      .put('https://localhost:5001/api/Contacts/' + form.value.Id, form.value)    
      .subscribe(responseData => { 
        console.log(responseData);
        if (responseData == null)       
          this.router.navigate(['/contact-list']);
    });
  }

}