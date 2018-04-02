// this is an hardcoded constant to map a team to the VSTS repos they 'own'.
// this is because VSTS does not have a concept of a team owning a repo. :shrug:
export const VSTS_REPOS = {
  'micro-cervezas': [
    'common-test',
    'common-retry',
    'bluemoon-admin-login',
    'bluemoon-config-server',
    'java-project-builder',
    'skyux-routes-long',
    'social-donation-receiver',
    'facebook-api-client',
    'common-logging',
    'bb-java-base-docker-image',
    'scs-definition-lng-lonextgen',
    'identity-token'
  ],
  'we-are-batman': [
    'skyux-spa-workflows',
    'workflow-designer',
    'azure-scheduler-sdk',
    'common-provider-pact',
    'actions-adapter',
    'constituent-adapter',
    'skyux-spa-workflow-designer-docs',
    'skyux-lib-action-form'
  ],
  'brady-bunch': [
    'social-posting',
    'token-store',
    'skyux-spa-social'
  ],
  'highlander': [
    'skyux-spa-donation-forms',
    'forms-management',
    'donation-form-reporting',
    'donation-form-reporting-database',
    'common-eventhubs'
  ],
  'voltron' : [
    'installment-engine',
    'skyux-spa-installment-scheduler',
    'skyux-spa-installment-scheduler-mock-client-skyux1'
  ]
};
