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

export interface IKafkaR {
  name: string;
}

export interface IKafka {
  topic?: string;
  num_partitions: number;
  replication_factor: number;
}

@Injectable({
  providedIn: 'root'
})
export class KafkaService extends mixinHttp(class {}, {
  baseUrl: 'https://transcend-vantage-dev.td.teradata.com/frameworks/kafkarestapi',
  baseHeaders: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
}) {

  @TdGET({
    path: '/topics',
  })
  getTopics(@TdResponse() response?: Observable<HttpResponse<any>>): Observable<IKafkaR[]> { return; }

  @TdPOST({
    path: '/topics',
  })
  createTopic(@TdBody() body: IKafka,
          @TdResponse() response?: Observable<HttpResponse<any>>): Observable<string> {
    return response.pipe(
      map((data: any) => {
        return 'Topic Created';
      }),
    );
  }
}
