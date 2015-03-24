var dispatcher = require('./dispatcher');
var constants = require('./constants');

var actions = {
  create: function(text) {
    dispatcher.dispatch({
      actionType: constants.TODO_CREATE,
      text: text
    });
  },
  destroy: function(id) {
    dispatcher.dispatch({
      id: id
    });
  },
  updateText: function(id, text) {
    dispatcher.dispatch({
      actionType: constants.TODO_UPDATE_TEXT,
      id: id,
      text: text
    });
  },
  undoDestroy: function() {
    dispatcher.dispatch({
      actionType: constants.TODO_UNDO_DESTROY
    })
  }
};

module.exports actions;
