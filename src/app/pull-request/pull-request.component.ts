import { Component, Input } from '@angular/core';
import { PullRequest } from '../../domain/action-item';
import * as moment from 'moment';

@Component({
  selector: 'mf-pull-request',
  templateUrl: './pull-request.component.html',
  styleUrls: ['./pull-request.component.css']
})
export class PullRequestComponent {
  public static readonly RED = 'red';
  public static readonly ORANGE = 'orange';
  public static readonly YELLOW = 'yellow';
  public static readonly GREY = 'grey';

  @Input()
  pr: PullRequest;

  constructor() { }

  getTimeElapsed(time) {
    return moment(time).fromNow();
  }

  get priorityClass(): String {
    const priority = this.pr.priority;
    switch (priority) {
      case 1: {
        return PullRequestComponent.RED;
      }
      case 2: {
        return PullRequestComponent.ORANGE;
      }
      case 3: {
        return PullRequestComponent.YELLOW;
      }
      case 4: {
        return PullRequestComponent.GREY;
      }
      default: {
        return '';
      }
    }
  }
}
