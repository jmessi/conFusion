import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessHTTPmsgService {

  constructor() { }

  public handleError(error: HttpErrorResponse | any){
    let errMsg: string;

    if(error.error instanceof ErrorEvent){ //comes from client side?
      errMsg = error.error.message;
    }
    else { //comes from server side
      errMsg = `${error.status} - ${error.statusText || ''} ${error.error}`;
    }

    return throwError(errMsg);
  }
}
