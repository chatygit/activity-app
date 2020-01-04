import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreditModel } from './credit-model';
import { TotalByLocation } from './total-by-location';

@Injectable()
export class DownstreamService {

    constructor(private http: HttpClient) {
    }

    getCreditData(): Observable<HttpResponse<CreditModel[]>> {

        const headers = new HttpHeaders().set('authorization', 'test');

        return this.http.get<CreditModel[]>('http://localhost:8080/credit/api', { headers, observe: 'response' });

    }

    getCreditMapLocation(year: number): Observable<HttpResponse<TotalByLocation[]>> {

        const headers = new HttpHeaders().set('authorization', 'test');

        return this.http.get<TotalByLocation[]>('http://localhost:8080/credit/api/aggregate/location/'+ year, { headers, observe: 'response' });

    }

    getCreditMapYear(): Observable<HttpResponse<TotalByLocation[]>> {

        const headers = new HttpHeaders().set('authorization', 'test');

        return this.http.get<TotalByLocation[]>('http://localhost:8080/credit/api/aggregate/year', { headers, observe: 'response' });

    }

}
