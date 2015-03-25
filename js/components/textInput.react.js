var React = require('react');

var ENTER_KEY_CODE = 13;

var TextInput = React.createClass({
  propTypes: {
    className: React.PropTypes.string,
    id: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    onSave: React.PropTypes.func.isRequired,
    value: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      this.props.value || ''
    };
  },

  render: function() {
    return (
      <input 
        className={this.props.className}
        id={this.props.id}
        placeholder={this.props.placeholder}
        value={this.props.value}
        onBlur={this._save}
        onChange={this._onChange}
        onKeyDown={this._onKeyDown}
        autofocus={true}
      />
    );
  },

  _save: function() {
    this.props.onSave(this.state.value);
    this.setState({value: ''});
  },

  _onKeyDown: function(event) {
    if(event.keyCode === ENTER_KEY_CODE) {
      this._save();
    }
  },

  _onChange: function(event) {
    this.setState({value: event.target.value});
  }
});

module.exports = TextInput;
