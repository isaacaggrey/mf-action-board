// It is not advised to make this constant very frequent since Github rate limits requests
export const ACTION_ITEM_POLLING_INTERVAL_IN_MS = 30000;

export const APP_LABELS = {
  TITLE: 'Action Item Dashboard'
};

export const PRIORITY = {
  RED: 'red',
  ORANGE: 'orange',
  YELLOW: 'yellow',
  GREY: 'grey'
};

export const CONFIG = {
  GITHUB: {
    TEAM: 'MF_GITHUB_TEAM',
    TEAM_ID: 'MF_GITHUB_TEAM_ID',
    USERNAME: 'MF_GITHUB_USERNAME',
    TOKEN: 'MF_GITHUB_TOKEN',
    WATCH_LIST: 'MF_GITHUB_WATCH_LIST',
  },
  VSTS: {
    TEAM: 'MF_VSTS_TEAM',
    USERNAME: 'MF_VSTS_USERNAME',
    TOKEN: 'MF_VSTS_TOKEN',
  }
};
