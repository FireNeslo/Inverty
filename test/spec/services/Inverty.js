'use strict';

describe('Service: Inverty', function () {

  // load the service's module
  beforeEach(module('InvertyApp'));

  // instantiate service
  var Inverty;
  beforeEach(inject(function(_Inverty_) {
    Inverty = _Inverty_;
  }));

  it('should do something', function () {
    expect(!!Inverty).toBe(true);
  });

});
