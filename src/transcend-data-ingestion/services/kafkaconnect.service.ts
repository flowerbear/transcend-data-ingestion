import { Injectable } from '@angular/core';

import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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
export class KafkaconnectService extends mixinHttp(class {}, {
  baseUrl: 'https://transcend-vantage-dev.td.teradata.com/kafka-connect/salesforce/api',
  baseHeaders: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
}) {

  @TdPOST({
    path: '/connectors',
  })
  startConnect(@TdBody() body: any, @TdResponse() response?: Observable<HttpResponse<any>>): Observable<any> { return; }

  @TdGET({
    path: '/connectors',
  })
  getKafkaTopics(@TdResponse() response?: Observable<HttpResponse<any>>): Observable<any> { return; }

}
