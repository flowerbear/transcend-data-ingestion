import { Injectable } from '@angular/core';

export interface IUser {
  id?: string;
  email?: string;
  site_admin?: boolean;
  member_of?: string;
  display_name?: string;
  token?: string;
}

export interface IJWTData {
  tokenId: string;
  data: IUser;
}

interface IPayload {
  id: string;
  exp: number;
  site_admin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class JWTDataService {

  constructor() { }

  getTokenId(): string {
    //console.log('getTokedId called');
    return localStorage.getItem('token_id');
  }

  getData(): IUser {
    return JSON.parse(localStorage.getItem('data'));
  }

  isTokenExpired(): boolean {
    const token: string = localStorage.getItem('token_id');
    if (!token) {
      return true;
    }
    let payload: string[] = token.split('.');
    if (payload[1]) {
      let payloadJSON: IPayload = JSON.parse(atob(payload[1]));
      const expiredTime: number = payload.length === 3 ? payloadJSON.exp * 1000 : undefined;
      return !token || (expiredTime ? (Date.now() > expiredTime) : true);
    }
    return true;
  }

  store(jwtData: IJWTData): void {
    //console.log('store called');
    localStorage.setItem('data', JSON.stringify(jwtData.data));
    localStorage.setItem('token_id', jwtData.tokenId);
  }

  clear(): void {
    localStorage.removeItem('data');
    localStorage.removeItem('token_id');
  }
}
