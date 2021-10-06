import { Component, OnInit, OnDestroy } from '@angular/core';
//import {ContactService } from 'src/app/services/contact.service';
import { HttpClient } from '@angular/common/http';
import { Contacts } from '../../../models/contacts';
import {Subject} from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  
  //Create list based on Contact model
  list: Contacts[] = [];  

  //Inject http service on contructor
  constructor(private http: HttpClient, private router: Router) { }   
  
  //On Start load call the Contact List
  ngOnInit(): void {
    this.RefreshList();        
  }
  
  //To release data on destroy
  ngOnDestroy():void{
    this.dtTrigger.unsubscribe();
  }

  //Set initial settings for datatable
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();  
  
  
  //Refresh method to fetch Contact List
  RefreshList() {
  this.http
    .get('https://localhost:5001/api/Contacts')    
    .subscribe(contacts => {
      this.list = contacts as Contacts[];
      this.dtTrigger.next();      
    });
  }

  //Set Route to pass parameter to Edit Contact
  populateData(data: Contacts){    
    this.router.navigate(['/contact-edit', data.id, data.contactName, data.contactType, data.contactPhone, data.birthday]);
  }
  
//Delete method to delete selected Contact element
onDelete(id:number)
{
  if (confirm('Are you sure to delete this Contact('+ id +')?'))
  {
    this.http.delete('https://localhost:5001/api/Contacts/'+id)
      .subscribe(response=>{
        document.getElementById('row-'+id)?.remove();        
      });
  }
}


}
