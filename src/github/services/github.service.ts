import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Job } from '../../domain/job';
import { ActionItem } from "../../domain/action-item";
import { PriorityCalculator } from "../../domain/priority-calculator";

@Injectable()
export class GithubService {

  constructor(private http:Http) {
  }

  getActionItems():Promise<ActionItem[]> {
    const headers = new Headers({'Authorization': 'Basic ' + window.btoa('Blackbaud-RyanMcKay:fde32c4c25f7d3f860e65bed07d8a4053e237499')});
    const options = new RequestOptions({headers: headers});
    return this.http.get('https://api.github.com/search/issues?q=is:open+is:pr+team:blackbaud/micro-cervezas', options)
      .toPromise()
      .then(response => response.json().items.map(this.convertToActionItem))
      .catch(this.handleError);
  }

  private convertToActionItem(pr:any):ActionItem {
    let regex = "/blackbaud/(.*)/issues";
    let repo = pr.url.match(regex)[1];
    return PriorityCalculator.calculatePriority({
      name: `${repo}: ${pr.title}`,
      priority: 0,
      type: 'Open PR',
      source: 'github',
      created: new Date(pr.created_at).getTime()
    });
  }

  private handleError(error:any):Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
