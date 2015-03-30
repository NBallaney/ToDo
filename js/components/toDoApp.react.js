var Header = require('./header.react');
var TodoList = require('./todoList.react');
var React = require('react');
var storeLogic = require('../store');
var storeAPI = storeLogic.API;
var store = storeLogic.store;
var actions = require('../actions');
var classSet = require('react/lib/cx');

var getTodoState = function() {
  return {
    allTodos: storeLogic.store.getAll(),
    isDestroyed: false  
  };
};

var TodoApp = React.createClass({
  getInitialState: function() {
    return {
      allTodos: {},
      isDestroyed: false
    };
  },

  componentDidMount: function() {
    var self = this;
    storeAPI.getAllTodos(function(data) {
      self.setState({
        allTodos: data,
        isDestroyed: false
      });
    });
    store.addChangeListener(this._onChange);
    store.addDestroyListener(this._onDestroy);
  },

  render: function() {
    var isDestroyed = this.state.isDestroyed;
    var className = classSet({'undo': isDestroyed, 'hidden': !isDestroyed});
    return (
      <div>
        <Header />
        <TodoList
          allTodos={this.state.allTodos}
        />
        <button className={className} onClick={this._onClick}>
          Undo Complete
        </button>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getTodoState());
  },

  _onDestroy: function() {
    this.setState({isDestroyed: true});
  },

  _onClick: function() {
    actions.undoDestroy();
  }
});

module.exports = TodoApp;


