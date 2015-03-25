var Header = require('./header.react');
var TodoList = require('./todoList.react');
var React = require('react');
var store = require('../store');

var getTodoState = function() {
  return {
    allTodos: store.getAll(),
    areAllComplete: store.areAllComplete()
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
        <TodoList
          allTodos={this.state.allTodos}
          areAllComplete={this.state.areAllComplete}
        />
      </div>
    );
  },

  _onChange: function() {
    this.setState(getTodoState());
  }
});

module.exports = TodoApp;


