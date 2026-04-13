import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AnalyticsService } from '../services/analytics/analytics.service';
import { AnalyticsEvent } from '../models/enums/analytics-events.enum';

@Injectable()
export class AnalyticsInterceptor implements HttpInterceptor {
  constructor(private analyticsService: AnalyticsService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const startTime = Date.now();

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          const duration = Date.now() - startTime;
          this.analyticsService.track(AnalyticsEvent.PAGE_VIEW, {
            endpoint: req.url,
            method: req.method,
            status_code: event.status,
            duration_ms: duration
          });
        }
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }
}
