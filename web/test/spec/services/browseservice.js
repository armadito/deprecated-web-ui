'use strict';

describe('Service: BrowseService', function () {

  // load the service's module
  beforeEach(module('armaditoApp'));

  // instantiate service
  var BrowseService;
  beforeEach(inject(function (_BrowseService_) {
    BrowseService = _BrowseService_;
  }));

  it('should do something', function () {
    expect(!!BrowseService).toBe(true);
  });

});
