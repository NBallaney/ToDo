jest.dontMock('../constants');
jest.dontMock('../store');
jest.dontMock('object-assign');

describe('store', function() {
  var constants = require('../constants');
  var dispatcher;
  var store;
  var callback;
  // var $ = require('jquery');

  var actionCreate = {
    actionType: constants.TODO_CREATE,
    text: 'Test'
  };

  var actionDestroy = {
    actionType: constants.TODO_DESTROY,
    id: 0
  };

  beforeEach(function() {
    dispatcher = require('../dispatcher');
    store = require('../store');
    callback = dispatcher.register.mock.calls[0][0];
  });
});
