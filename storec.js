var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/// ////////////////////////////
// Mini Redux implementation //
/// ////////////////////////////

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
      console.log('subscriber', subscribers);
    }
  };
  store.dispatch({ type: '@@redux/INIT' });
  return store;
};

/// ///////////////////
// Our action types //
/// ///////////////////

const CREATE_NOTE = 'CREATE_NOTE';
const UPDATE_NOTE = 'UPDATE_NOTE';

/// //////////////
// Our reducer //
/// //////////////

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

/// ////////////
// Our store //
/// ////////////

const store = createStore(reducer);

/// ////////////////////////////////////////////
// Render our app whenever the store changes //
/// ////////////////////////////////////////////

store.subscribe(() => {
  ReactDOM.render(React.createElement(
    'pre',
    null,
    JSON.stringify(store.getState(), null, 2)
  ), document.getElementById('root'));
});

/// ///////////////////
// Dispatch actions //
/// ///////////////////

store.dispatch({
  type: CREATE_NOTE
});

store.dispatch({
  type: UPDATE_NOTE,
  id: 1,
  content: 'Hello, world!'
});
