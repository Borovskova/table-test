import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITUser } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private url: string = 'https://jsonplaceholder.typicode.com/users';
  constructor(private _http: HttpClient) { }

  public getData(params?: HttpParams): Observable<ITUser[]> {
    return this._getDataRequest(params);
  }
  private _getDataRequest(params?: HttpParams): Observable<ITUser[]> {
    return this._http.get<ITUser[]>(this.url, { params });
  }
}
