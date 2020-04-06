import { Injectable } from '@angular/core';

import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import {
  mixinHttp,
  TdGET,
  TdPOST,
  TdPUT,
  TdDELETE,
  TdBody,
  TdParam,
  TdResponse,
  TdQueryParams,
} from '@covalent/http';

export interface ISystem {
  system_id?: string;
  owner?: string[];
  collaborators?: string[];
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  name?: string;
  description?: string;
  system_type?: string;
  system_info?: ISystemInfo;
  properties?: ISystemProperties;
  production?: boolean;
  state?: number;
  targets?: string[];
  targetsCount?: number;
}

export interface ISystemInfo {
  host?: string;
  node?: string;
  port?: string | number;
  database?: string;
  username?: string;
  password?: string;
}

export interface ISystemValidation extends ISystemInfo, ISystemProperties {
  system_type?: string;
  properties?: ISystemProperties;
}

export interface ISystemProperties {
  webhcat?: ISystemWebHcatProperties;
  zookeeper_host?: string;
  zookeeper_parent?: string;
  zookeeper_port?: string;
  kerberized?: boolean;
  is_multihomed?: boolean;
}

export interface ISystemWebHcatProperties {
  host?: string;
  port?: string;
  table?: string;
  username?: string;
  password?: string;
}

export enum SourceType {
  REST = 1,
  MQTT = 2,
  KAFKA = 3,
}

export interface IMQTTSubscriptionInfo {
  broker?: string;
  state?: string;
  reason?: string;
  topic?: string;
  private_key?: string;
  certificate?: string;
  zookeeper?: string;
}

export interface ISource {
  source_id?: string;
  owner?: string[];
  created_at?: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  name?: string;
  description?: string;
  secret?: string;
  state?: number;
  starred?: boolean;
  production?: boolean;
  source_type?: string;
  size?: number;
  associated_targets?: string[];
  subscription_info?: IMQTTSubscriptionInfo;
  simple_metrics?: IMetric;
  is_volumetrics_enabled?: boolean;
}

export interface IValue {
  value?: number;
}

export interface IVolume {
  avg_bytes?: IValue;
  doc_count: number;
  ingested_records: IValue;
  time: string;
  total_bytes?: IValue;
  total_docs?: IValue;
}

export interface IMetric {
  records: number;
  size: number;
}

export interface INgxDataPoint {
  value: number;
  name: Date;
}

export interface INgxDataSeries {
  name: string;
  series: INgxDataPoint[];
}

export enum BundleType {
  records = <any>'records',
}

export interface IPageConfig {
  type_singular?: string;
  type_plural?: string;
  type_route?: string;
  type_title?: string;
  type_description?: string;
  type_overview?: string;
  type_info?: string;
  type_metadata?: string;
  type_error?: string;
  type_unavailable?: string;
  search_type?: string;
  manage_type?: string;
  create_type?: string;
  pause_type?: string;
  start_type?: string;
  edit_type?: string;
  add_type?: string;
  create_edit_type?: string;
  create_edit_type_desc?: string;
  delete_type?: string;
  delete_type_message?: string;
  refresh_type?: string;
  loading_type?: string;
  no_type?: string;
  all_type?: string;
  type_icon?: string;
  started_icon?: string;
}

export const targetConfig: IPageConfig = {
  type_singular: 'target',
  type_plural: 'targets',
  type_route: '/targets',
  type_title: 'TARGETS',
  type_description: 'TARGETS.DESCRIPTION',
  type_overview: 'TARGET_OVERVIEW',
  type_info: 'TARGET_INFO',
  type_metadata: 'TARGET_INFO.DESCRIPTION',
  type_error: 'TARGET_ERROR_LOWERCASE',
  type_unavailable: 'TARGET_UNAVAILABLE',
  search_type: 'SEARCH_BY_TARGET',
  manage_type: 'MANAGE_TARGETS',
  create_type: 'CREATE_TARGET',
  pause_type: 'PAUSE_TARGET',
  start_type: 'START_TARGET',
  edit_type: 'EDIT_TARGET',
  add_type: 'ADD_TARGET',
  create_edit_type: 'CREATE_EDIT_TARGET',
  create_edit_type_desc: 'CREATE_EDIT_TARGET.DESCRIPTION',
  delete_type: 'DELETE_TARGET',
  delete_type_message: 'DELETE_TARGET_NAMED.MESSAGE',
  refresh_type: 'REFRESH_TARGET',
  loading_type: 'LOADING_TARGET_STATUS',
  no_type: 'NO_TARGETS',
  all_type: 'ALL_TARGETS',
  type_icon: 'gps_fixed',
  started_icon: 'archive',
};

export const broadcastConfig: IPageConfig = {
  type_singular: 'stream',
  type_plural: 'streams',
  type_route: '/streams',
  type_title: 'BROADCAST_STREAMS',
  type_description: 'BROADCAST_STREAMS.DESCRIPTION',
  type_overview: 'BROADCAST_OVERVIEW',
  type_info: 'BROADCAST_INFO',
  type_metadata: 'BROADCAST_INFO.DESCRIPTION',
  type_error: 'STREAM_ERROR',
  type_unavailable: 'STREAM_UNAVAILABLE',
  search_type: 'SEARCH_BY_STREAM',
  manage_type: 'MANAGE_BROADCAST_STREAMS',
  create_type: 'CREATE_STREAM',
  pause_type: 'PAUSE_STREAM',
  start_type: 'START_STREAM',
  edit_type: 'EDIT_STREAM',
  add_type: 'ADD_STREAM',
  create_edit_type: 'CREATE_EDIT_STREAM',
  create_edit_type_desc: 'CREATE_EDIT_STREAM.DESCRIPTION',
  delete_type: 'DELETE_STREAM',
  delete_type_message: 'DELETE_STREAM_NAMED.MESSAGE',
  refresh_type: 'REFRESH_STREAM',
  loading_type: 'LOADING_STREAM_STATUS',
  no_type: 'NO_STREAMS',
  all_type: 'ALL_BROADCAST_STREAMS',
  type_icon: 'rss_feed',
  started_icon: 'leak_add',
};

export interface ITarget {
  bundle?: boolean;
  bundle_interval?: number;
  bundle_type?: BundleType;
  created_at?: string;
  created_by?: string;
  data_map?: ITargetDataMap;
  data_path?: ITargetDataPath;
  dead_letter_queue?: string;
  dead_letter_queue_count?: ITargetDLQCount;
  description?: string;
  name?: string;
  owner?: string[];
  production?: boolean;
  properties?: ITargetProperties;
  sample_size?: number;
  source_id?: string;
  state?: string;
  status?: ITargetStatus;
  system_id?: string;
  system_info?: ITargetSystemInfo;
  target_id?: string;
  target_type?: string;
  updated_at?: string;
  updated_by?: string;
  use_dead_letter_queue?: boolean;
  timeout?: any;
  avg_latency?: number;
}

export interface ITargetDataMap {
  mapping?: ITargetColumn[];
  mapping_type?: string;
}

export interface ITargetDataPath {
  // td, aster, hbase
  schema?: string;
  table?: string;
  foreign_server?: string;

  // hdfs
  path?: string;
  extension?: string;

  // websocket
  secret?: string;
  url?: string;
  websocket?: string;
}

export interface ITargetColumn {
  column?: string;
  field?: string;
  type?: string;
}

export interface ITargetProperties {
  webhcat?: IWebHcatProperties;
  kdc?: string;
  principal?: string;
  base64KeytabContent?: string;
}

export interface IWebHcatProperties {
  table?: string;
  username?: string;
  password?: string;
}

export interface ITargetSystemInfo {
  username?: string;
  password?: string;
  target_subtype?: string;
}

export interface ITargetStatus {
  status?: string;
  reason?: string;
  can_pause?: boolean;
  can_start?: boolean;
  error?: string;
}

export interface ITargetDLQRecords {
  uuid?: string;
  date?: string;
  error_code?: number;
  error_reason?: string;
  data?: string;
}

export interface ITargetDLQCount {
  count?: number;
}

export interface ILatency {
  avg?: number;
  count?: number;
  max?: number;
  min?: number;
  sum?: number;
}

export interface ITargetLatency {
  doc_count?: number;
  latency?: ILatency;
  time?: string;
}

export interface IUser {
  id?: string;
  email?: string;
  site_admin?: boolean;
  member_of?: string;
  display_name?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ListenerService extends mixinHttp(class {}, {
  baseUrl: 'https://transcend-vantage-dev.td.teradata.com/listener/appservices',
  baseHeaders: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
}) {

  @TdGET({
    path: '/systems',
  })
  getSystems(@TdResponse() response?: Observable<HttpResponse<any>>): Observable<ISystem[]> {
    //console.log('getSystem REST called');
    return; }

  @TdPOST({
    path: '/systems',
  })
  createSystem(@TdBody() body: any, @TdResponse() response?: Observable<HttpResponse<any>>): Observable<any> { return; }

  @TdGET({
    path: '/sources',
  })
  getSources(@TdResponse() response?: Observable<HttpResponse<any>>): Observable<ISource[]> { return; }

  @TdPOST({
    path: '/sources',
  })
  createSource(@TdBody() body: any, @TdResponse() response?: Observable<HttpResponse<any>>): Observable<any> { return; }

  @TdGET({
    path: '/targets',
  })
  getTargets(@TdResponse() response?: Observable<HttpResponse<any>>): Observable<ITarget[]> { return; }

  @TdPOST({
    path: '/targets',
  })
  createTarget(@TdBody() body: any, @TdResponse() response?: Observable<HttpResponse<any>>): Observable<any> { return; }

  @TdPUT({
    path: '/targets/:id/start'
  })
  startTarget(@TdParam('id') id: string, @TdResponse() response?: Observable<HttpResponse<any>>): Observable<any> { return; }

  @TdPUT({
    path: '/targets/:id/pause'
  })
  pauseTarget(@TdParam('id') id: string, @TdResponse() response?: Observable<HttpResponse<any>>): Observable<any> { return; }

  @TdGET({
    path: '/targets/:id/status'
  })
  statusTarget(@TdParam('id') id: string, @TdResponse() response?: Observable<HttpResponse<any>>): Observable<any> { return; }

  @TdDELETE({
    path: '/targets/:id'
  })
  deleteTarget(@TdParam('id') id: string, @TdResponse() response?: Observable<HttpResponse<any>>): Observable<any> { return; }
}
