// It is not advised to make this constant very frequent
// since Github rate limits requests
export const ACTION_ITEM_POLLING_INTERVAL_IN_MS = 30000;

export const MF_GITHUB_TEAM = 'MF_GITHUB_TEAM';
export const MF_GITHUB_TEAM_ID = 'MF_GITHUB_TEAM_ID';
export const MF_GITHUB_USERNAME = 'MF_GITHUB_USERNAME';
export const MF_GITHUB_TOKEN = 'MF_GITHUB_TOKEN';
export const MF_VSTS_USERNAME = 'MF_VSTS_USERNAME';
export const MF_VSTS_TOKEN = 'MF_VSTS_TOKEN';
export const MF_VSTS_TEAM = 'MF_VSTS_TEAM';
export const GITHUB_PR_SLA_MS = 14400000;
export const JENKINS_ACTION_ITEM_SLA_MS = 43200000;
export const JENKINS_JOB_BUILDING_COLOR = 'red_anime';
export const JENKINS_ENV = [
  'https://jenkins-oscf-dev.blackbaudcloud.com/',
  'https://jenkins-oscf-releases.blackbaudcloud.com/'
];
