import { OtgDashboardPage } from './app.po';

describe('otg-dashboard App', () => {
  let page: OtgDashboardPage;

  beforeEach(() => {
    page = new OtgDashboardPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
