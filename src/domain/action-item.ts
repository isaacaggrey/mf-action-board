import { GITHUB_PR_SLA_MS, JENKINS_ACTION_ITEM_SLA_MS } from '../config/app-config-constants';
import { DO_NOT_MERGE_LABEL_NAME } from '../github/services/github.constants';
import { JobDetails } from './jobDetails';
import * as moment from 'moment';

export abstract class BaseActionItem {
  url: string;
  name: string;
  created: number;
  priority: number;
  model: string;
  source: string;

  abstract get type();
}

export abstract class PullRequest extends BaseActionItem {
  do_not_merge: boolean;

  static calcPriority(created: number, do_not_merge: boolean): number {
      const timeElapsed = Date.now() - created;
      if (do_not_merge === true) {
        return 4;
      } else if (timeElapsed >= GITHUB_PR_SLA_MS) {
        return 1;
      } else if (timeElapsed >= (GITHUB_PR_SLA_MS / 2)) {
        return 2;
      } else {
        return 3;
      }
  }

  get type() {
    return 'pr';
  }
}

export class GitHubPullRequest extends PullRequest {
  constructor(prInfo: any) {
    super();
    const repo = prInfo.url.match('/blackbaud/(.*)/issues')[1];
    this.name = `${repo}: ${prInfo.title}`;
    this.created = new Date(prInfo.created_at).getTime();
    this.url = prInfo.html_url;
    this.do_not_merge = prInfo.labels.map(l => l.name).includes(DO_NOT_MERGE_LABEL_NAME);
    this.priority = PullRequest.calcPriority(this.created, this.do_not_merge);
  }
}

export class VstsPullRequest extends PullRequest {
  ACCOUNT = 'blackbaud';
  COLLECTION = 'DefaultCollection';
  VERSION = '2.0';
  PROJECT = 'Products';
  ROOTURL = `https://${this.ACCOUNT}.VisualStudio.com/${this.COLLECTION}/${this.PROJECT}`;

  constructor(prInfo: any) {
    super();
    const repo = prInfo.repository.name;
    this.name = `${repo}: ${prInfo.title}`;
    this.created = new Date(prInfo.creationDate).getTime();
    this.url = `${this.ROOTURL}/_git/${repo}/pullrequest/${prInfo.pullRequestId}`;
    this.do_not_merge = this.hasDoNotMergeFlag(prInfo.title);
    this.priority = PullRequest.calcPriority(this.created, this.do_not_merge);
  }

  private hasDoNotMergeFlag(prTitle: string): boolean {
    return prTitle && prTitle.toLocaleLowerCase().startsWith('[do not merge]');
  }
}

export class Build extends BaseActionItem {
  building: boolean;
  buildPercentage: number;

  static calcBuildPercentage(building: boolean, timestampCurrentBuild: string, estimatedDuration: string): number {
    if (building) {
      const elapsedDuration = Date.now() - parseInt(timestampCurrentBuild, 10);
      return Math.max(5, Math.floor((elapsedDuration * 100) / parseInt(estimatedDuration, 10)));
    } else {
      return null;
    }
  }

  static calcPriority(created: number): number {
    const timeElapsed = Date.now() - created;
    if (timeElapsed >= JENKINS_ACTION_ITEM_SLA_MS) {
      return 1;
    } else if (timeElapsed >= (JENKINS_ACTION_ITEM_SLA_MS / 2)) {
      return 2;
    } else {
      return 3;
    }
  }

  get type() {
    return 'build';
  }
}

export class VstsBuild extends Build {
  ACCOUNT = 'blackbaud';
  PROJECT = 'Products';
  ROOTURL = `https://${this.ACCOUNT}.VisualStudio.com/${this.PROJECT}`;

  constructor(jobInfo: any) {
    super();
    this.name = jobInfo.definition.name;
    this.created = moment(jobInfo.finishTime).valueOf();
    this.url = `${this.ROOTURL}/_build?buildId=${jobInfo.id}`;
    this.building = false;
    this.buildPercentage = null;
    this.priority = Build.calcPriority(this.created);
  }
}

export class VstsRelease extends Build {
  constructor(releaseInfo: any) {
    super();
    this.name = releaseInfo.releaseDefinition.name;
    this.created = moment(releaseInfo.createdOn).valueOf();
    this.url = releaseInfo._links.web.href;
    const inProgressEnvs = releaseInfo.environments.filter(env => env.status === 'inProgress');
    this.building = inProgressEnvs.length > 0;
    this.buildPercentage = 50;
    this.priority = (this.building) ? 4 : Build.calcPriority(this.created);
  }
}

export class JenkinsBuild extends Build {
  constructor(jobDetails: JobDetails) {
    super();
    this.name = jobDetails.jobName;
    this.created = new Date(jobDetails.timestampLastCompletedBuild).getTime();
    this.url = jobDetails.url;
    this.building = jobDetails.building;
    this.buildPercentage = Build.calcBuildPercentage(this.building, jobDetails.timestampCurrentBuild, jobDetails.estimatedDuration);
    this.priority = Build.calcPriority(this.created);
  }
}

export type ActionItem = PullRequest | Build;
