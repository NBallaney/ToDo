var dispatcher = require('./dispatcher');
var EventEmitter = require('events').EventEmitter;
var constants = require('./constants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var DESTROY_EVENT = 'destroy';
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
    text: text
  };

  $.ajax({
    url:'/',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({text: text, id: id}),
    success: function(data) {
      console.log('Todo Created');
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
      console.log('Todo Completed');
    }.bind(this),
    error: function(xhr, status, err) {
      console.error('/', status, err.toString());
    }.bind(this)
  });
};

var store = exports.store = assign({}, EventEmitter.prototype, {
  getAll: function() {
    return _todos;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  emitDestroy: function() {
    this.emit(DESTROY_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  addDestroyListener: function(callback) {
    this.on(DESTROY_EVENT, callback);
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
      store.emitDestroy();
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
