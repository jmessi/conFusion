import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPmsgService } from './process-httpmsg.service';


@Injectable({
  providedIn: 'root'
})

export class DishService {

  constructor(
    private http: HttpClient,
    private processHTTPmsgService: ProcessHTTPmsgService) { }

  getDishes(): Observable<Dish[]>{
    return this.http.get<Dish[]>(baseURL + 'dishes')
      .pipe(catchError(this.processHTTPmsgService.handleError));
    //gets data from localhost:3000/dishes
  }

  getDish(id: any): Observable<Dish>{
    return this.http.get<Dish>(baseURL + 'dishes/' + id)
      .pipe(catchError(this.processHTTPmsgService.handleError));
  }

  getFeaturedDish(): Observable<Dish>{
    return this.http.get<Dish[]>(baseURL + 'dishes?featured=true')
      .pipe(map(dishes => dishes[0]))
      .pipe(catchError(this.processHTTPmsgService.handleError));
    //sends query to the server asking
  }

  getDishIds(): Observable<number[] | any>{
    return this.getDishes()
      .pipe(map(dishes => dishes.map(dish => dish.id)))
      .pipe(catchError(error => error));
  }

  putDish(dish: Dish): Observable<Dish>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put<Dish>(
      baseURL + 'dishes/' + dish.id,
      dish,
      httpOptions)
      .pipe(catchError(this.processHTTPmsgService.handleError));
  }

}
