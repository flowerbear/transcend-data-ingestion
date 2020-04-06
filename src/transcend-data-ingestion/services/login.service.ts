import { Injectable } from '@angular/core';

import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { JWTDataService, IUser } from './jwt-data.service';

import {
  mixinHttp,
  TdGET,
  TdPOST,
  TdBody,
  TdParam,
  TdResponse,
  TdQueryParams,
} from '@covalent/http';


@Injectable({
  providedIn: 'root'
})
export class LoginService extends mixinHttp(class {}, {
  baseUrl: 'https://transcend-vantage-dev.td.teradata.com/listener/appservices',
  baseHeaders: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
}) {

  @TdPOST({
    path: '/users/login',
  })
  login(@TdBody() user: {username: string, password: string}, @TdResponse() response?: Observable<HttpResponse<any>>): Observable<any> {
    //console.log('login rest called');
    return response.pipe(map((data: any) => {
      //console.log(data.token);
      let tokenId: string = data.token;
      this._jwtDataService.store({data: data, tokenId: tokenId });
      //console.log('store called');
      return data;
      }),
    );
  }

  constructor(private _jwtDataService: JWTDataService) {
    super();
  }
}
