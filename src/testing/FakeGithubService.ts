import { ActionItem } from '../domain/action-item';
export class FakeGithubService {
    actionItems: ActionItem[] = [];

    getActionItems(): Promise<ActionItem[]> {
        return Promise.resolve(this.getItems());
    }

    private getItems() {
        return this.actionItems;
    }
}
