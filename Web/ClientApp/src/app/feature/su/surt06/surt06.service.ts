import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Surt06Service {

  constructor(private http:HttpClient) { }


  list = (keywords) => this.http.get('surt06' , {params : {keywords}});

  delete = (parameterGroupCode) => this.http.delete('surt06' , {params : {parameterGroupCode}});
}
