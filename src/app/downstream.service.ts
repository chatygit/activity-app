import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreditModel } from './credit-model';
import { TotalByLocation } from './total-by-location';

@Injectable()
export class DownstreamService {

    constructor(private http: HttpClient) {
    }

    getCreditDataLocal(year): Observable<HttpResponse<CreditModel[]>> {

        const headers = new HttpHeaders().set('authorization', 'test');

        return this.http.get<CreditModel[]>('assets/old-data/visa-' + year + '.json', { headers, observe: 'response' });

    }


    getCreditData(year): Observable<HttpResponse<CreditModel[]>> {

        const headers = new HttpHeaders().set('authorization', 'test');

        return this.http.get<CreditModel[]>('assets/old-list/vsa-'+ year + '.json', { headers, observe: 'response' });

    }

    getCreditCategory(year): Observable<HttpResponse<CreditModel[]>> {

        const headers = new HttpHeaders().set('authorization', 'test');

        return this.http.get<CreditModel[]>('http://localhost:8080/credit/api/aggregate/category/'+ year, { headers, observe: 'response' });

    }

    getCreditMapLocation(year: number): Observable<HttpResponse<TotalByLocation[]>> {

        const headers = new HttpHeaders().set('authorization', 'test');

        return this.http.get<TotalByLocation[]>('http://localhost:8080/credit/api/aggregate/location/'+ year, { headers, observe: 'response' });

    }

    getCreditMapYear(): Observable<HttpResponse<TotalByLocation[]>> {

        const headers = new HttpHeaders().set('authorization', 'test');

        return this.http.get<TotalByLocation[]>('http://localhost:8080/credit/api/aggregate/year', { headers, observe: 'response' });

    }

    getCreditMapYearLocal(): Observable<HttpResponse<TotalByLocation[]>> {

        const headers = new HttpHeaders().set('authorization', 'test');

        return this.http.get<TotalByLocation[]>('assets/old-data/aggregate-year.json', { headers, observe: 'response' });

    }

}
