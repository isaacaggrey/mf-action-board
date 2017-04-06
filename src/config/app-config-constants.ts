export const GITHUB_TEAM = 'blackbaud/micro-cervezas';
export const GITHUB_USER = 'Blackbaud-RyanMcKay';
export const GITHUB_TOKEN = 'fde32c4c25f7d3f860e65bed07d8a4053e237499';
export const GITHUB_PR_SLA_MS = 3600000*2;
export const JENKINS_ACTION_ITEM_SLA_MS = 43200000;
export const JENKINS_ENV = [
  {
    'baseUrl': 'jenkins',
    'projects': [
      'bluemoon-admin-login_build',
      'bluemoon-admin-ui_build',
      'bluemoon-config-server_build',
      'bluemoon-core_build',
      'bluemoon-ui_build',
      'cloud-foundry-tools_build',
      'common-test_build',
      'deployment-tracker_build',
      'geocodio-client_build',
      'geodude_build',
      'gradle-core_build',
      'gradle-docker_build',
      'gradle-internal_build',
      'jenkins-jobs-dsl_build',
      'lo-groups_build',
      'loki_build',
      'notifications-component_build',
      'notifications_build',
      'release-the-tracken_build',
      'seed-job'
    ],
    'url': 'https://jenkins-oscf-sandbox.blackbaudcloud.com/',
    'updateInterval': 60,
    'name': 'build-test',
    'disabled': false
  },
  {
    'baseUrl': 'jenkins',
    'projects': [
      'bluemoon-admin-login_build',
      'bluemoon-admin-ui_build',
      'bluemoon-config-server_build',
      'bluemoon-core_build',
      'bluemoon-ui_build',
      'cloud-foundry-tools_build',
      'common-test_build',
      'deployment-tracker_build',
      'geocodio-client_build',
      'geodude_build',
      'gradle-core_build',
      'gradle-docker_build',
      'gradle-internal_build',
      'gradle-templates_build',
      'jenkins-jobs-dsl_build',
      'lo-groups_build',
      'loki_build',
      'notifications-component_build',
      'notifications_build',
      'release-the-tracken_build',
      'seed-job',
      'swagger-client-templates_build',
      'swagger-codegen_build'
    ],
    'url': 'https://jenkins-oscf-dev.blackbaudcloud.com/',
    'updateInterval': 60,
    'name': 'build-test',
    'disabled': false
  },
  {
    'baseUrl': 'jenkins',
    'projects': [
      'bluemoon-admin-login_dev-apps-deploy',
      'bluemoon-admin-login_int-apps-deploy',
      'bluemoon-admin-ui_int-apps-test',
      'bluemoon-core_dev-apps-deploy',
      'bluemoon-core_int-apps-deploy',
      'bluemoon-ui_int-apps-test',
      'deployment-tracker_dev-apps-deploy',
      'deployment-tracker_int-apps-deploy',
      'geodude_dev-apps-deploy',
      'geodude_int-apps-deploy',
      'lo-groups-integration_int-apps-test',
      'lo-groups_dev-apps-deploy',
      'lo-groups_int-apps-deploy',
      'notifications-component_dev-apps-test',
      'notifications-component_dev-apps-test-nightly',
      'notifications-component_int-apps-test',
      'notifications_dev-apps-deploy',
      'notifications_int-apps-deploy',
      'release-the-tracken_dev-apps-deploy',
      'release-the-tracken_dev-apps-test',
      'release-the-tracken_dev-apps-test-nightly',
      'release-the-tracken_int-apps-deploy',
      'release-the-tracken_int-apps-test',
      'search-int-tests_int-apps-test'
    ],
    'url': 'https://jenkins-oscf-dev.blackbaudcloud.com/',
    'updateInterval': 60,
    'name': 'int+dev',
    'disabled': false
  },
  {
    'baseUrl': 'jenkins',
    'projects': [
      'bluemoon-admin-login_promote',
      'bluemoon-admin-login_release',
      'bluemoon-admin-ui_uat-apps-test',
      'bluemoon-config-server_promote',
      'bluemoon-config-server_release',
      'bluemoon-core_promote',
      'bluemoon-core_release',
      'bluemoon-ui_uat-apps-test',
      'cloud-foundry-tools_promote',
      'deployment-tracker_promote',
      'deployment-tracker_release',
      'lo-groups_promote',
      'lo-groups_release',
      'notifications_promote',
      'notifications_release',
      'release-the-tracken_promote',
      'release-the-tracken_release',
      'release-the-tracken_uat-apps-test',
      'seed-job'
    ],
    'url': 'https://jenkins-long-releases.blackbaudcloud.com/',
    'updateInterval': 60,
    'name': 'release',
    'disabled': true
  },
  {
    'baseUrl': 'jenkins',
    'projects': [
      'next-gen-integration'
    ],
    'url': 'https://jenkins-releases.blackbaudcloud.com/',
    'updateInterval': 60,
    'name': 'LO'
  }
];
