// this is an hardcoded constant to map a team to the VSTS repos they 'own'.
// this is because VSTS does not have a concept of a team owning a repo. :shrug:
export const VSTS_REPOS = {
  'micro-cervezas': [
    'common-test',
    'bluemoon-admin-login',
    'bluemoon-config-server',
    'java-project-builder',
    'skyux-routes-long',
    'social-donation-receiver'
  ],
  'we-are-batman': [
    'skyux-spa-workflows',
    'workflow-designer'
  ],
  'brady-bunch': [
    'social-posting',
    'token-store',
    'skyux-spa-social'
  ]
};
