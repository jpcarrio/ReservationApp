import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Contacts } from '../models/contacts';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }

  readonly baseURL = 'https://localhost:5001/api/Contacts';

  //formData : Contacts = new Contacts();

}
