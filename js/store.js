var dispatcher = require('./dispatcher');
var EventEmitter = require('events').EventEmitter;
var TodoConstants = require('./constants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _todos = {};

function create(text) {
  var id = Date.now();
  _todos[id] = {
    id: id,
    complete: false,
    text: text
  };
}
