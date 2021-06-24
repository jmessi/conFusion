import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPmsgService } from './process-httpmsg.service';
import { baseURL } from '../shared/baseurl';


@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(
    private http: HttpClient,
    private processHTTPmsgService: ProcessHTTPmsgService) { }

  getLeaders(): Observable<Leader[]>{
    return this.http.get<Leader[]>(baseURL + 'leadership')
    .pipe(catchError(this.processHTTPmsgService.handleError));
    //gets data from localhost:3000/leadership
  }

  getLeader(id: any): Observable<Leader>{
    return this.http.get<Leader>(baseURL + 'leadership/' + id)
      .pipe(catchError(this.processHTTPmsgService.handleError));

  }

  getFeaturedLeader(): Observable<Leader>{
    return this.http.get<Leader[]>(baseURL + 'leadership?featured=true')
      .pipe(map(leaders => leaders[0]))
      .pipe(catchError(this.processHTTPmsgService.handleError));
  }

  getLeaderIds(): Observable<number[] | any>{
    return this.getLeaders()
      .pipe(map(leaders => leaders.map(leader => leader.id)))
      .pipe(catchError(this.processHTTPmsgService.handleError));
  }

  putLeader(leader: Leader): Observable<Leader>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put<Leader>(
      baseURL + 'leadership/' + leader.id,
      leader,
      httpOptions)
      .pipe(catchError(this.processHTTPmsgService.handleError));
  }
}
