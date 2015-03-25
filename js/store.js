var dispatcher = require('./dispatcher');
var EventEmitter = require('events').EventEmitter;
var TodoConstants = require('./constants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _todos = {};

var create = function(text) {
  var id = Date.now();
  _todos[id] = {
    id: id,
    complete: false,
    text: text
  };
};

var update = function(id, updates) {
  _todos[id] = assign({}, _todos[id], updates);
};

var destroy = function(id) {
  delete _todos[id];
};

var store = assign({}, EventEmitter.prototype, {
  areAllComplete: function() {
    for(var id in _todos) {
      if(!_todos[id].complete) {
        return false;
      }
    }
    return true;
  },

  getAll: function() {
    return _todos;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

dispatcher.register(function(action) {
  var text;
  var destroyed;

  switch(action.actionType) {
    case constants.TODO_CREATE:
      text = action.text.trim();
      if(text !== '') {
        create(text);
        store.emitChange();
      }
      break;

    case constants.TODO_DESTROY:
      destroyed = action;
      destroy(action.id);
      store.emitChange();
      break;

    case constants.TODO_UNDO_DESTROY:
      update(destroyed.id, destroyed);
      store.emitChange();
      break;

    case constants.TODO_UPDATE_TEXT:
      text = action.text.trim();
      if(text !== '') {
        update(action.id, {text: text});
        store.emitChange();
      }

    default
      //No default
  }
});

module.exports = store;
