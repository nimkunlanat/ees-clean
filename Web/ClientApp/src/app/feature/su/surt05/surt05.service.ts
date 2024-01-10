import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '@app/models/su/message';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Surt05Service {

  constructor(private http: HttpClient) { }

  list = (keywords: string = ""): Observable<Message[]> => this.http.disableLoading().get<Message[]>("surt05/list", { params: { keywords } })

}