'use strict';

describe('Service: highscore', function () {

  // load the service's module
  beforeEach(module('InvertyApp'));

  // instantiate service
  var highscore;
  beforeEach(inject(function(_highscore_) {
    highscore = _highscore_;
  }));

  it('should do something', function () {
    expect(!!highscore).toBe(true);
  });

});
