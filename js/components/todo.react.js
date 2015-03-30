var React = require('react');
var ReactPropTypes = React.PropTypes;
var actions = require('../actions');
var TextInput = require('./textInput.react');

var classSet = require('react/lib/cx');

var Todo = React.createClass({
  propTypes: {
    todo: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {isEditing: false};
  },

  render: function() {
    var todo = this.props.todo;
    var editedText;

    if(this.state.isEditing) {
      editedText =
          <TextInput
            className="edit"
            onSave={this._onSave}
            value={todo.text}
          />;
    }

    var className = classSet({'editing': this.state.isEditing});

    return (
      <li className={className} key={todo.id}>
        <div>
          <input
            className="toggle"
            type="checkbox"
            checked={todo.complete}
            onChange={this._destroy}
          />
          <label onClick={this._editingClick}>
            {todo.text}
          </label>
        </div>
        {editedText}
      </li>
    );
  },

  _destroy: function() {
    actions.destroy(this.props.todo.id);
  },

  _editingClick: function() {
    this.setState({isEditing: true});
  },

  _onSave: function(text) {
    actions.updateText(this.props.todo.id, text);
    this.setState({isEditing: false});
  }
});

module.exports = Todo;


