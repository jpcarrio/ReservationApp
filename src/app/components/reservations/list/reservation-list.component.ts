import { Component, OnInit, OnDestroy } from '@angular/core';
import {DataTablesModule} from 'angular-datatables';
import { Reservation } from '../../../models/reservation';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})


export class ReservationListComponent implements OnInit {
  
  list: Reservation[] = [];  

  constructor(private http: HttpClient, private router: Router) { } 

  ngOnInit(): void {    
    this.RefreshList();  
  }

  //To release data on destroy
  ngOnDestroy():void{
    this.dtTrigger.unsubscribe();
  }

  //Setting for DataTables component
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();  

  //Refresh method to fetch Reservation List
  RefreshList() {
    this.http
      .get('https://localhost:5001/api/Reservations')    
      .subscribe(reservations => {
        this.list = reservations as Reservation[];
        this.dtTrigger.next();      
      }
    );
  }

  //Delete method to delete selected Reservation
  onDelete(id:number)
  {
    if (confirm('Are you sure to delete this Reservation('+ id +')?'))
    {
      this.http.delete('https://localhost:5001/api/Reservations/'+id)
      .subscribe(response=>{
        document.getElementById('row-'+id)?.remove();        
        }
      );
    }
  }
  
   //Set Route to pass parameter to Edit Reservation
  populateData(data: Reservation){    
    this.router.navigate(['/reservation-edit', data.id, data.contactId, data.reservationPlace, data.reservationDate]);
  }
}
