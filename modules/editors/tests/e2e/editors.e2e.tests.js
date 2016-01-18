'use strict';

describe('Editors E2E Tests:', function () {
  describe('Test editors page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/editors');
      expect(element.all(by.repeater('editor in editors')).count()).toEqual(0);
    });
  });
});
