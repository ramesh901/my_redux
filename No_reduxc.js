//import React from 'react'
// import ReactDOM from 'react-dom'

/*
Summary - Bottom up Approach
* First create the state
* Assign to window.state
* Creat
*/

const initialState = {
  nextNoteId: 1,
  notes: {}
};

window.state = initialState;

const onAddNote = () => {
  const id = window.state.nextNoteId;
  window.state.notes[id] = {
    id: id + 1,
    content: ''
  };
  window.state.nextNoteId++;
  renderApp();
};

const NoteApp = ({ notes }) => React.createElement(
  'div',
  null,
  React.createElement(
    'ul',
    { className: 'note-list' },
    Object.keys(notes).map(id =>
    // Obviously we should render something more interesting than the id.
    React.createElement(
      'li',
      { className: 'note-list-item', key: id },
      id
    ))
  ),
  React.createElement(
    'button',
    { className: 'editor-button', onClick: onAddNote },
    'New Note'
  )
);

const renderApp = () => {
  ReactDOM.render(React.createElement(NoteApp, { notes: window.state.notes }), document.getElementById('root'));
};

renderApp();
