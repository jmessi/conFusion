import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPmsgService } from './process-httpmsg.service';
import { baseURL } from '../shared/baseurl';


@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(
    private http: HttpClient,
    private processHTTPmsgService: ProcessHTTPmsgService) { }

  getPromotions(): Observable<Promotion[]>{
    return this.http.get<Promotion[]>(baseURL + 'promotions')
      .pipe(catchError(this.processHTTPmsgService.handleError));
      //gets data from localhost:3000/promotions
    }

  getPromotion(id: any): Observable<Promotion>{
    return this.http.get<Promotion>(baseURL + 'promotions/' + id)
      .pipe(catchError(this.processHTTPmsgService.handleError));
  }

  getFeaturedPromotion(): Observable<Promotion>{
    return this.http.get<Promotion[]>(baseURL + 'promotions?featured=true')
      .pipe(map(promotions => promotions[0]))
      .pipe(catchError(this.processHTTPmsgService.handleError));
  }

  getPromoIds(): Observable<number[] | any>{
    return this.getPromotions()
      .pipe(map(promotions => promotions.map(promotion => promotion.id)))
      .pipe(catchError(this.processHTTPmsgService.handleError));
  }

  putPromo(promotion: Promotion): Observable<Promotion>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.put<Promotion>(
      baseURL + 'promotions/' + promotion.id,
      promotion,
      httpOptions)
      .pipe(catchError(this.processHTTPmsgService.handleError));
  }
}
