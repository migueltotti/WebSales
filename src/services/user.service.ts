import { Injectable } from '@angular/core';
import { catchError, of, tap, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../models/user';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { QueryStringParameters } from '../models/queryStringParameters';

const apiUrl = 'https://localhost:44373/api/Users';
var httpOptions = {headers: new HttpHeaders({
  "Content-Type": "application/json"
})};
var token: string | null;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  montarHeaderToken() {
    token = sessionStorage.getItem("jwt");
    console.log('jwt header token ' + token)
    httpOptions = {headers: new HttpHeaders({"Authorization" : "Bearer " + token, "Content-Type": "application/json"})}
  }

  getUsers(
    httpOp: {headers: HttpHeaders} = httpOptions,
    parameters: QueryStringParameters | null = null) : Observable<HttpResponse<User[]>> 
  {
    var apiPagUrl = apiUrl; 

    if(parameters != null){
      apiPagUrl += `?PageNumber=${parameters!.pageNumber}&PageSize=${parameters!.pageSize}`;
    }

    return this.http.get<HttpResponse<User[]>>(
      apiPagUrl,
      httpOp
    ).pipe(
      tap(User => console.log('users received successfully')),
      catchError(err => {
        console.log(err);
        return throwError(err);
      })
    );
  }

  getUserByEmail(email: string): Observable<User> {
    const url = apiUrl + '/email/' + email;
    return this.http.get<User>(
      url, httpOptions
    ).pipe(
      tap((Product: User) => console.log('user received successfully')),
      catchError(this.handleError<User>('getUser'))
    );
  }

  getUserById(id: number): Observable<User> {
    const url = `${apiUrl}/${id}`;
    this.montarHeaderToken();
    return this.http.get<User>(
      url, httpOptions
    ).pipe(
      tap((User: User) => console.log('user received successfully')),
      catchError(this.handleError<User>('getUser'))
    );
  }

  addUser(user: User): Observable<User> {
    this.montarHeaderToken();
    return this.http.post<User>(
      apiUrl, user, httpOptions
    ).pipe(
      tap((Product: any) => console.log('user added successfully')),
      catchError(this.handleError<User>('addUser'))
    );
  }

  updateUser(id: number, user: User): Observable<any> {
    const url = apiUrl + '/' + id;

    this.montarHeaderToken();
    console.log(url);
    console.log(httpOptions);

    return this.http.put(
      url, user, httpOptions
    ).pipe(
      tap(_ => console.log('user edited successfully with id=' + user.userId)),
      catchError(this.handleError<User>('updateUser'))
    );
  }

  deleteUser(id: number): Observable<any> {
    const url = apiUrl + '/' + id;
    
    this.montarHeaderToken();

    return this.http.delete<User>(
      url, httpOptions
    ).pipe(
      tap(_ => console.log('user deleted successfully with id=' + id)),
      catchError(this.handleError<User>('deleteUser'))
    );
  }

  toUser(form: FormGroup<any>) : User{
    console.log('Dentro do toUser');
    console.log(form.value);

    const user = new User(
      parseInt(form.get('userId')?.value, 10),
      form.get('name')?.value,
      form.get('email')?.value,
      form.get('password')?.value,
      form.get('cpf')?.value,
      parseFloat(form.get('points')?.value),
      form.get('dateBirth')?.value,
      parseInt(form.get('affiliateId')?.value, 10),
      parseInt(form.get('role')?.value, 10)
    );

    return user;
  }

  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
}
