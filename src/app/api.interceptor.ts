import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { CONSTANTS } from './contants';
import { SpinnerService } from './shared/services/spinner.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private spinner: SpinnerService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.spinner.show();
    request = request.clone({
      setParams: {
        apiKey: CONSTANTS.CURRENCY_API_KEY,
      },
    });
    return next.handle(request).pipe(finalize(() => this.spinner.hide()));
  }
}
