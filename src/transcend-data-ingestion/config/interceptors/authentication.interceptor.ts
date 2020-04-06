import { Injectable } from '@angular/core';
import { ITdHttpInterceptor, ITdHttpRESTOptionsWithBody } from '@covalent/http';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { JWTDataService } from '../../services/jwt-data.service';

@Injectable()
export class AuthenticationInterceptor implements ITdHttpInterceptor {

  constructor(private _jwtDataService: JWTDataService) { }

  handleOptions(options: ITdHttpRESTOptionsWithBody): ITdHttpRESTOptionsWithBody {

    if (!options.headers) {
      options.headers = new HttpHeaders();
    }
    if (options.headers instanceof HttpHeaders) {
      options.headers = options.headers.set('Authorization', 'Bearer ' + this._jwtDataService.getTokenId());
    } else if (options.headers instanceof Array) {
      options.headers.push('Authorization', 'Bearer ' + this._jwtDataService.getTokenId());
    }
    //console.log('Interceptor called');
    return options;
  }
}
