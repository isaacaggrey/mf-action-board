import { ActionItem } from '../domain/action-item';
export class FakeJenkinsService {
    actionItems: ActionItem[] = [];

    loadRepos() {
        return Promise.resolve();
    }

    public getActionItems(): Promise<ActionItem[]> {
        return Promise.resolve(this.getItems());
    }

    private getItems() {
        return this.actionItems;
    }
}
