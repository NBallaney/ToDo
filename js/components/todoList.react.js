var React = require('react');
var actions = require('../actions');
var TodoItem = require('./todoItem.react');

var TodoList = React.createClass({

  propTypes: {
    allTodos: React.PropTypes.object.isRequired
  },

  render: function() {
     var allTodos = this.props.allTodos;
     var todos = [];

     if (Object.keys(allTodos).length < 1) {
       return null;
     }

     for (var key in allTodos) {
       todos.push(<TodoItem key={key} todo={allTodos[key]} />);
     }

     return (
       <section className="main">
         <ul className="todo-list">{todos}</ul>
       </section>
     );
   }
});

module.exports = TodoList;
