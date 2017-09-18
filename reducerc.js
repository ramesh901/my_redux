var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const CREATE_NOTE = 'CREATE_NOTE';
const UPDATE_NOTE = 'UPDATE_NOTE';

const initialState = {
  nextNoteId: 1,
  notes: {}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_NOTE:
      {
        const id = state.nextNoteId;
        const newNote = {
          id,
          content: ''
        };
        return _extends({}, state, {
          nextNoteId: id + 1,
          notes: _extends({}, state.notes, {
            [id]: newNote
          })
        });
      }
    case UPDATE_NOTE:
      {
        const { id, content } = action;
        const editedNote = _extends({}, state.notes[id], {
          content
        });
        return _extends({}, state, {
          notes: _extends({}, state.notes, {
            [id]: editedNote
          })
        });
      }
    default:
      return state;
  }
};

const state0 = reducer(undefined, {
  type: CREATE_NOTE
});

const state1 = reducer(state0, {
  type: UPDATE_NOTE,
  id: 1,
  content: 'Hello, world!'
});

ReactDOM.render(React.createElement(
  'pre',
  null,
  JSON.stringify(state1, null, 2)
), document.getElementById('root'));
