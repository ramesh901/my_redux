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
}

window.state = initialState

const onAddNote = () => {
  const id = window.state.nextNoteId
  window.state.notes[id] = {
    id: id+10, //For testing purpose, incremented by 10 it doesn't have any 
                //effect in the program. we are accessing only the 'key' in 
                //NoteApp function
    content: ''
  }
  window.state.nextNoteId++
  renderApp()
}

const NoteApp = ({notes}) => (
  <div>
    <ul className='note-list'>
      {
      Object.keys(notes).map(id => (
        // Obviously we should render something more interesting than the id.
        <li className='note-list-item' key={id}>{id}</li>
      ))
    }
    </ul>
    <button className='editor-button' onClick={onAddNote}>New Note</button>
  </div>
)

const renderApp = () => {
  ReactDOM.render(
    <NoteApp notes={window.state.notes} />,
    document.getElementById('root')
  )
}

renderApp()
