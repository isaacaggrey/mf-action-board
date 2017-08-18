import { browser, element, by } from 'protractor';

export class OtgDashboardPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('mf-app-root h1')).getText();
  }
}
