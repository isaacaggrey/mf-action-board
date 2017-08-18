import {TestBed, async, fakeAsync, flush} from '@angular/core/testing';

import { ActionItemsComponent } from './action-items.component';
import { FormsModule } from '@angular/forms';
import { GithubService } from '../github/services/github.service';
import { JenkinsService } from '../jenkins/services/jenkins.service';
import { ConfigService } from '../config/config.service';
import { NotificationsService } from '../notifications/services/notifications.service';
import { FakeGithubService } from '../testing/FakeGithubService';
import { FakeJenkinsService } from '../testing/FakeJenkinsService';
import { FakeNotificationsService } from '../testing/FakeNotificationsService';
import { FakeConfigService } from '../testing/FakeConfigService';

const actionItemTextClass = '.action-item-text';
let compiled;
let fixture;
let isConfigured = false;
const mockConfig = {
    team: 'bros',
    teamId: '1010101',
    userName: 'dude bro',
    token: 'goober'
};
const mockJenkinsJob = {
    name: 'search-int-tests_int-apps',
    priority: 3,
    type: 'jenkins',
    source: 'jenkins',
    created: 1502982366421,
    url: 'http://www.burgers.com',
    do_not_merge: false
};

const mockPrReview = {
    name: 'segments',
    priority: 2,
    type: 'PR Review',
    source: 'github',
    created: 1502982366420,
    url: 'http://www.french-fries.com',
    do_not_merge: false
};

const componentElements = {
    actionItemLabelsList: () => { return compiled.querySelectorAll(actionItemTextClass); },
    actionItemLabels: (actionItemIndex: number) => { return componentElements.actionItemLabelsList()[actionItemIndex].textContent; },
    teamName: () => { return compiled.querySelector('#teamUsingBoard').textContent; }
};

describe('Action Items', () => {
    describe('without configuration', () => {
        beforeEach(async(() => {
            compiled = createComponent();
        }));

        it('should show the configuration action items', async(() => {
            expect(componentElements.actionItemLabels(0)).toContain('GitHub Team Name');
            expect(componentElements.actionItemLabels(1)).toContain('GitHub Team ID');
            expect(componentElements.actionItemLabels(2)).toContain('GitHub User Name');
            expect(componentElements.actionItemLabels(3)).toContain('GitHub Token');
        }));
    });

    describe('with configuration', () => {
        beforeEach((async() => {
            isConfigured = true;
            compiled = createComponent();
            const jenkinsSpy = fixture.debugElement.injector.get(JenkinsService) as any;
            jenkinsSpy.actionItems = [
                mockJenkinsJob
            ];
            const githubSpy = fixture.debugElement.injector.get(GithubService) as any;
            githubSpy.actionItems = [
                mockPrReview
            ];
            const configSpy = fixture.debugElement.injector.get(ConfigService) as any;
            configSpy.configured = true;
            configSpy.githubConfig = mockConfig;
            fixture.detectChanges();
        }));

        it('should show action items', fakeAsync(() => {
            fixture.componentInstance.getActionItemsList();
            flush();
            fixture.detectChanges();
            expect(componentElements.actionItemLabelsList().length).toBe(2);
            expect(componentElements.actionItemLabels(0)).toContain(mockPrReview.name);
            expect(componentElements.actionItemLabels(1)).toContain(mockJenkinsJob.name);
        }));

        it('should show team name', fakeAsync(() => {
            flush();
            fixture.detectChanges();
            expect(componentElements.teamName()).toContain(mockConfig.team);
        }));
    });
});

function createComponent() {
    TestBed.configureTestingModule({
        imports:      [ FormsModule ],
        declarations: [
            ActionItemsComponent
        ],
        providers: [
            { provide: GithubService, useClass: FakeGithubService},
            { provide: JenkinsService, useClass: FakeJenkinsService},
            { provide: ConfigService, useClass: FakeConfigService},
            { provide: NotificationsService, useClass: FakeNotificationsService}
        ]
    }).compileComponents();
    fixture = TestBed.createComponent(ActionItemsComponent);
    fixture.detectChanges();
    return fixture.debugElement.nativeElement;
}
