import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Job } from '../../domain/job';

@Injectable()
export class JenkinsService {

  constructor(private http: Http) { }

  getBuilds(): Promise<Job[]> {
    const headers = new Headers({ 'Authorization': window.btoa('christopher.cotar:5a6bfb6a406a1e50de33a137a0ec1c70') });
    const options = new RequestOptions({ headers: headers });
    return this.http.get('https://jenkins-oscf-dev.blackbaudcloud.com/api/json', options)
      .toPromise()
      .then(response => { console.log(response); return response.json().jobs as Job[]; })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
