var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

///////////////////////////////
// Mini Redux implementation //
///////////////////////////////

const validateAction = action => {
  if (!action || typeof action !== 'object' || Array.isArray(action)) {
    throw new Error('Action must be an object!');
  }
  if (typeof action.type === 'undefined') {
    throw new Error('Action must have a type!');
  }
};

const createStore = reducer => {
  let state;
  const subscribers = [];
  const store = {
    dispatch: action => {
      validateAction(action);
      state = reducer(state, action);
      subscribers.forEach(handler => handler());
    },
    getState: () => state,
    subscribe: handler => {
      subscribers.push(handler);
      return () => {
        const index = subscribers.indexOf(handler);
        if (index > 0) {
          subscribers.splice(index, 1);
        }
      };
    }
  };
  store.dispatch({ type: '@@redux/INIT' });
  return store;
};

//////////////////////
// Our action types //
//////////////////////

const CREATE_NOTE = 'CREATE_NOTE';
const UPDATE_NOTE = 'UPDATE_NOTE';
const OPEN_NOTE = 'OPEN_NOTE';
const CLOSE_NOTE = 'CLOSE_NOTE';

/////////////////
// Our reducer //
/////////////////

const initialState = {
  nextNoteId: 1,
  notes: {},
  openNoteId: null
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
          openNoteId: id,
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
    case OPEN_NOTE:
      {
        return _extends({}, state, {
          openNoteId: action.id
        });
      }
    case CLOSE_NOTE:
      {
        return _extends({}, state, {
          openNoteId: null
        });
      }
    default:
      return state;
  }
};

///////////////
// Our store //
///////////////

const store = createStore(reducer);

////////////////////
// Our components //
////////////////////

const NoteEditor = ({ note, onChangeNote, onCloseNote }) => React.createElement(
  'div',
  null,
  React.createElement(
    'div',
    null,
    React.createElement('textarea', {
      className: 'editor-content',
      autoFocus: true,
      value: note.content,
      onChange: event => onChangeNote(note.id, event.target.value)
    })
  ),
  React.createElement(
    'button',
    { className: 'editor-button', onClick: onCloseNote },
    'Close'
  )
);

const NoteTitle = ({ note }) => {
  const title = note.content.split('\n')[0].replace(/^\s+|\s+$/g, '');
  if (title === '') {
    return React.createElement(
      'i',
      null,
      'Untitled'
    );
  }
  return React.createElement(
    'span',
    null,
    title
  );
};

const NoteLink = ({ note, onOpenNote }) => React.createElement(
  'li',
  { className: 'note-list-item' },
  React.createElement(
    'a',
    { href: '#', onClick: () => onOpenNote(note.id) },
    React.createElement(NoteTitle, { note: note })
  )
);

const NoteList = ({ notes, onOpenNote }) => React.createElement(
  'ul',
  { className: 'note-list' },
  Object.keys(notes).map(id => React.createElement(NoteLink, {
    key: id,
    note: notes[id],
    onOpenNote: onOpenNote
  }))
);

const NoteApp = ({
  notes, openNoteId, onAddNote, onChangeNote,
  onOpenNote, onCloseNote
}) => React.createElement(
  'div',
  null,
  openNoteId ? React.createElement(NoteEditor, {
    note: notes[openNoteId],
    onChangeNote: onChangeNote,
    onCloseNote: onCloseNote
  }) : React.createElement(
    'div',
    null,
    React.createElement(NoteList, {
      notes: notes,
      onOpenNote: onOpenNote
    }),
    React.createElement(
      'button',
      {
        className: 'editor-button',
        onClick: onAddNote
      },
      'New Note'
    )
  )
);

class NoteAppContainer extends React.Component {
  constructor(props) {
    super();
    this.state = props.store.getState();
    this.onAddNote = this.onAddNote.bind(this);
    this.onChangeNote = this.onChangeNote.bind(this);
    this.onOpenNote = this.onOpenNote.bind(this);
    this.onCloseNote = this.onCloseNote.bind(this);
  }
  componentWillMount() {
    this.unsubscribe = this.props.store.subscribe(() => this.setState(this.props.store.getState()));
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  onAddNote() {
    this.props.store.dispatch({
      type: CREATE_NOTE
    });
  }
  onChangeNote(id, content) {
    this.props.store.dispatch({
      type: UPDATE_NOTE,
      id,
      content
    });
  }
  onOpenNote(id) {
    this.props.store.dispatch({
      type: OPEN_NOTE,
      id
    });
  }
  onCloseNote() {
    this.props.store.dispatch({
      type: CLOSE_NOTE
    });
  }
  render() {
    return React.createElement(NoteApp, _extends({}, this.state, {
      onAddNote: this.onAddNote,
      onChangeNote: this.onChangeNote,
      onOpenNote: this.onOpenNote,
      onCloseNote: this.onCloseNote
    }));
  }
}

////////////////////
// Render our app //
////////////////////

ReactDOM.render(React.createElement(NoteAppContainer, { store: store }), document.getElementById('root'));
