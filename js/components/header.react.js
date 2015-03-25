var React = require('react');
var actions = ('../actions');
var textInput = ('./textInput.react');

var Header = React.createClass({
  render: function() {
    return (
      <header id="header">
        <h1>Tasks</h1>
        <TextInput 
          id="new-todo"
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
