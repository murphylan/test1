import { HttpClient } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { catchError, map, tap, toArray, mergeMap } from 'rxjs/operators';
import { User } from './user';
import { Injectable } from '@angular/core';
import { GithubApi } from './github-api';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl = 'https://api.github.com/users?per_page='; 
  // private usersUrl = 'http://localhost:3000/users?per_page=';

  constructor(private http: HttpClient) { }

  // getUsers(size: number): Observable<User[]> {
  //   return this.fetchURL<User[]>(this.usersUrl + size);
  // }

  getUsers(size: number): Observable<User[]> {
    return this.fetchURL<User[]>(this.usersUrl + size).pipe(
      mergeMap(users => {
        let urls = users.map(user => user.url);
        return from(urls).pipe(
          mergeMap(url => this.fetchURL<User>(`${url}`)),
          toArray(),
          catchError((error) => {
            console.log("something went wrong, " + error);
            return of([]);
          })
        );
      }),
      catchError((error) => {
        console.log("something went wrong, " + error.message ? error.message : error.error);
        let u: User[] = [{ 'name': '无记录' }]
        return of(u);
      })
    );
  }

  getItems(users: User[]): Observable<User[]> {
    let urls = users.map(user => user.url);
    return from(urls).pipe(
      mergeMap(url => this.fetchURL<User>(`${url}`)),
      toArray()
    );
  }

  fetchURL<T>(url: string) {
    return this.http.get<T>(url);
  }

  getRepoIssues(sort: string, order: string, page: number): Observable<GithubApi> {
    const href = 'https://api.github.com/search/issues';
    const requestUrl =
        `${href}?q=repo:angular/components&sort=${sort}&order=${order}&page=${page + 1}`;

    return this.http.get<GithubApi>(requestUrl);
  }
}