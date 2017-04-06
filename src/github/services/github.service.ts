import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Job } from '../../domain/job';

@Injectable()
export class GithubService {

  constructor(private http:Http) {
  }

  getActionItems():void {
    const headers = new Headers({'Authorization': 'Basic ' + window.btoa('Blackbaud-RyanMcKay:fde32c4c25f7d3f860e65bed07d8a4053e237499')});
    const options = new RequestOptions({headers: headers});
    this.http.get('https://api.github.com/search/issues?q=is:open+is:pr+team:blackbaud/micro-cervezas', options)
      .toPromise()
      //.then(response => response.json().items)
      .then(response => console.log(response.json().items))
      .catch(this.handleError);
  }

  private handleError(error:any):Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
