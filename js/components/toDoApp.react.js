var Header = require('./header.react');
var TodoList = require('./todoList.react');
var React = require('react');
var storeLogic = require('../store');
var actions = require('../actions');

var getTodoState = function() {
  return {
    allTodos: storeLogic.store.getAll()
  };
};

var TodoApp = React.createClass({
  getInitialState: function() {
    return {
      allTodos: {}
    };
  },

  componentDidMount: function() {
    var self = this;
    storeLogic.API.getAllTodos(function(data) {
      self.setState({
        allTodos: data
      });
    });
    storeLogic.store.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    storeLogic.store.removeChangeListener(this._onChange);
  },

  render: function() {
    return (
      <div>
        <Header />
        <button onClick={this._onClick}>
          Undo Complete
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


