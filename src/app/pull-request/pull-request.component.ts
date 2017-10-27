import { Component, Input } from '@angular/core';
import { PullRequest } from '../../domain/action-item';
import { ActionItemComponent } from '../action-item/action-item.component';

@Component({
  selector: 'mf-pull-request',
  templateUrl: './pull-request.component.html',
  styleUrls: ['./pull-request.component.css']
})
export class PullRequestComponent extends ActionItemComponent {
  @Input()
  pr: PullRequest;

  get priorityClass(): String {
    return this.calcPriorityClass(this.pr.priority)
  }
}
