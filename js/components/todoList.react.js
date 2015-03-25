var React = require('react');
var actions = require('../actions');
var Todo = require('./todo.react');

var TodoList = React.createClass({

  propTypes: {
    allTodos: React.PropTypes.object.isRequired,
    areAllComplete: React.PropTypes.bool.isRequired
  },

  render: function() {
     if (Object.keys(this.props.allTodos).length < 1) {
       return null;
     }

     var allTodos = this.props.allTodos;
     var todos = [];

     for (var key in allTodos) {
       todos.push(<Todo key={key} todo={allTodos[key]} />);
     }

     return (
       <section id="main">
         <ul id="todo-list">{todos}</ul>
       </section>
     );
   }
});

module.exports = TodoList;
