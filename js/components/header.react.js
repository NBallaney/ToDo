var React = require('react');
var actions = require('../actions');
var TextInput = require('./textInput.react');

var Header = React.createClass({
  render: function() {
    return (
      <header id="header">
        <h1>ToDo</h1>
        <TextInput 
          className="new-todo"
          placeholder="I need to .."
          onSave={this._onSave}
        />
      </header>
    );
  },

  _onSave: function(text) {
    actions.create(text);
  }
});

module.exports = Header;
