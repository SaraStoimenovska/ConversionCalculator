import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private readonly CURRENCY_URL = 'https://free.currconv.com/api/v7';

  constructor(private http: HttpClient) {}

  getCurrencyList(): Observable<any> {
    const CURRENCY_LIST_URL = `${this.CURRENCY_URL}/currencies`;
    return this.http.get(CURRENCY_LIST_URL);
  }

  convertCurrencies(query: string): Observable<any> {
    const params: HttpParams = new HttpParams()
      .set('q', query)
      .set('compact', 'ultra');
    const CURRENCY_LIST_URL = `${this.CURRENCY_URL}/convert`;
    return this.http.get(CURRENCY_LIST_URL, { params });
  }

  showHistoricalData(
    query: string,
    date: string,
    endDate: string
  ): Observable<any> {
    const params: HttpParams = new HttpParams()
      .set('q', query)
      .set('compact', 'ultra')
      .set('date', date)
      .set('endDate', endDate);
    const CURRENCY_HISTORY_URL = `${this.CURRENCY_URL}/convert`;
    return this.http.get(CURRENCY_HISTORY_URL, { params });
  }
}
