/*
 * This is an e2e test suite.
 */

describe( 'ng-boilerplate.home', function() {
  var url = '/base/build/index.html#/home';
  describe( 'smoke test', function() {

    it( 'initial state', function () {
      // Trigger state change: Load page
      browser().navigateTo(url);

      expect(element('div[ui-view] h1', 'content heading').text()).toContain('Non-Trivial AngularJS Made Easy');

      // Check URL partial: /home
      expect(browser().window().hash()).toEqual('/home');
    });

  });
});