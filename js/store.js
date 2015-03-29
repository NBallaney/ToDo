var dispatcher = require('./dispatcher');
var EventEmitter = require('events').EventEmitter;
var constants = require('./constants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _todos = {};
var destroyed;

var API = exports.API = {
  getAllTodos: function(callback) {
    $.ajax({
      url: '/getTodos',
      dataType: 'json',
      contentType: 'application/json',
      success: function(data) {
        var todos = {};
        data.forEach(function(todo) {
          todos[todo.id] = {
            id: todo.id,
            complete: false,
            text: todo.text
          };
        });
        return callback(todos);
      }.bind(this),
      error: function(xhr, state, err) {
        console.error('/', status, err.toString());
      }.bind(this)
    });
  }
}

API.getAllTodos(function(todos) {
  _todos = todos;
});


var create = function(text) {
  var id = Date.now();
  _todos[id] = {
    id: id,
    complete: false,
    text: text
  };

  $.ajax({
    url:'/',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({text: text, id: id}),
    success: function() {
      console.log('Posted successfully');
    }.bind(this),
    error: function(xhr, status, err) {
      console.error('/', status, err.toString());
    }.bind(this)
  });
};


var update = function(id, updates) {
  _todos[id] = assign({}, _todos[id], updates);
};

var destroy = function(id) {
  destroyed = _todos[id];
  delete _todos[id];
  $.ajax({
    url:'/' + id,
    type: 'DELETE',
    success: function() {
      console.log('Deleted successfully');
    }.bind(this),
    error: function(xhr, status, err) {
      console.error('/', status, err.toString());
    }.bind(this)
  });
};

var store = exports.store = assign({}, EventEmitter.prototype, {
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

  switch(action.actionType) {
    case constants.TODO_CREATE:
      text = action.text.trim();
      if(text !== '') {
        create(text);
        store.emitChange();
      }
      break;

    case constants.TODO_DESTROY:
      destroy(action.id);
      store.emitChange();
      break;

    case constants.TODO_UNDO_DESTROY:
      if(destroyed){
        create(destroyed.text);
        store.emitChange();
        destroyed = null;
      }
      break;

    case constants.TODO_UPDATE_TEXT:
      text = action.text.trim();
      if(text !== '') {
        update(action.id, {text: text});
        store.emitChange();
      }

    default:
      //No default
  }
});
