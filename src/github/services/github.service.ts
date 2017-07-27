import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { ActionItem } from '../../domain/action-item';
import { PriorityCalculator } from '../../domain/priority-calculator';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class GithubService {

  constructor(private http: Http, private configService: ConfigService) {
  }

  getActionItems(): Promise<ActionItem[]> {
    const mfGithubTeam = this.configService.getConfig().team;
    const mfGithubUsername = this.configService.getConfig().userName;
    const mfGithubToken = this.configService.getConfig().token;
    const headers = new Headers({'Authorization': 'Basic ' + window.btoa(mfGithubUsername + ':' + mfGithubToken)});
    const options = new RequestOptions({headers: headers});
    return this.http.get('https://api.github.com/search/issues?q=is:open+is:pr+team:' + mfGithubTeam, options)
      .toPromise()
      .then(response => response.json().items.map(this.convertToActionItem))
      .catch(this.handleError);
  }

  private convertToActionItem(pr: any): ActionItem {
    const regex = '/blackbaud/(.*)/issues';
    const repo = pr.url.match(regex)[1];
    return PriorityCalculator.calculatePriority({
      name: `${repo}: ${pr.title}`,
      priority: 0,
      type: 'Open PR',
      source: 'github',
      created: new Date(pr.created_at).getTime(),
      url: `${pr.html_url}`
    });
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    // ignore failure so that Promise.All() in calling component can resolve successful calls
    return Promise.resolve({});
  }
}
