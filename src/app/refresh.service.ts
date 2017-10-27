import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import { ACTION_ITEM_POLLING_INTERVAL_IN_MS } from './app.constants';
import * as moment from 'moment';

@Injectable()
export class RefreshService {
  private appLastModified;

  constructor(private http: Http) {
    this.appLastModified = moment();
    setInterval(() => {
      this.checkForRefresh();
    }, ACTION_ITEM_POLLING_INTERVAL_IN_MS);
  }

  public checkForRefresh() {
    const siteUrl = window.location.href;
    this.http.head(siteUrl)
      .map(response => response.headers.get('Last-Modified'))
      .subscribe(lastModifiedHeader => {
        if (lastModifiedHeader !== null && this.isBeforeAppModified(lastModifiedHeader)) {
          console.log(`Reloading application since it was last modified at ${lastModifiedHeader}`);
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        }
      });
  }

  private isBeforeAppModified(lastModifiedHeader: string) {
    return this.appLastModified.isBefore(moment(lastModifiedHeader));
  }
}
