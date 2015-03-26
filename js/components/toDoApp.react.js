var Header = require('./header.react');
var TodoList = require('./todoList.react');
var React = require('react');
var store = require('../store');
var actions = require('../actions');

var getTodoState = function() {
  return {
    allTodos: store.getAll(),
  };
};

var TodoApp = React.createClass({
  getInitialState: function() {
    return getTodoState();
  },

  componentDidMount: function() {
    store.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    store.removeChangeListener(this._onChange);
  },

  render: function() {
    return (
      <div>
        <Header />
        <button onClick={this._onClick}>
          Undo
        </button>
        <TodoList
          allTodos={this.state.allTodos}
        />
      </div>
    );
  },

  _onChange: function() {
    this.setState(getTodoState());
  },

  _onClick: function() {
    actions.undoDestroy();
  }
});

module.exports = TodoApp;


