var Header = require('./header.react');
var todoList = require('./todoList.react');
var React = require('react');
var store = requie('../store');

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
    TodoStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    TodoStore.removeChangeListener(this._onChange);
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
});

