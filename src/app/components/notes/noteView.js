import _ from 'lodash'
import MarkDown from 'pagedown'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ButtonToolbar, Button, Input, Label, Glyphicon } from 'react-bootstrap'
import * as NoteActions from 'actions/notes'
import SelectList from 'components/selectList'

const md = MarkDown.getSanitizingConverter()

class NoteView extends Component {
  constructor (props) {
    super(props)
    this.state = {editing: props.note.title === ''}
  }

  componentWillUnmount () {
    if (this.state.editing) this.saveEdit()
  }

  handleEnter = (event) => {
    if (event.which === 13) {
      this.saveEdit()
    }
  }

  handleEsc = (event) => {
    if (event.which === 27) {
      this.saveEdit()
    }
  }

  saveEdit = () => {
    var title = this.refs.titleInput.getValue() || this.props.note.title
    var content = this.refs.contentInput.getValue() || this.props.note.content
    this.props.actions.editNote(this.props.note.id, {title, content})
    this.setState({editing: false})
  }

  deleteNote = () => {
    if (window.confirm(`Do you want to delete this note: '${this.props.note.title}'?`)) {
      this.props.actions.deleteNote(this.props.note.id)
    }
  }

  renderContent () {
    const { note } = this.props
    if (this.state.editing) {
      return (
        <div className='note-list__content editing'>
          <div className='note-list__note__edit-form'>
            <Input
              type='text' ref='titleInput' autoFocus
              onKeyDown={this.handleEsc}
              onKeyPress={this.handleEnter}
              label='Title' defaultValue={note.title} />
            <Input type='textarea' rows='10' ref='contentInput'
              onKeyDown={this.handleEsc}
              label='Content' defaultValue={note.content} />
          </div>
          <ButtonToolbar className='card-dialog__button-bar'>
            <Button
              onClick={() => this.setState({editing: false})} >
            Cancel
            </Button>
            <Button bsStyle='success'
              onClick={this.saveEdit} >
            Save
            </Button>
            <Button className='card-dialog__delete'
              onClick={this.deleteNote} >
              Delete
            </Button>
          </ButtonToolbar>
        </div>
      )
    } else {
      return <div className='note-list__content' onClick={() => this.setState({editing: true})}>
        <div dangerouslySetInnerHTML={{__html: md.makeHtml(note.content || '')}}></div>
      </div>
    }
  }

  renderNote () {
    const { note } = this.props
    let klasses = 'note-list__note'
    if (this.state.editing) klasses += ' editing'
    return (
      <div className={klasses}>
        <h4 className='text-center secondary-text' onClick={() => this.setState({editing: true})}>
          {note.title}
        </h4>
        <div className='note-list__body'>
          <div className='note-list__left-side'>
            <SelectList
              parentId={this.props.note.id} type={'Characters'}
              selectedItems={this.props.note.characters}
              allItems={this.props.characters}
              add={this.props.actions.addCharacter}
              remove={this.props.actions.removeCharacter} />
            <SelectList
              parentId={this.props.note.id} type={'Places'}
              selectedItems={this.props.note.places}
              allItems={this.props.places}
              add={this.props.actions.addPlace}
              remove={this.props.actions.removePlace} />
            <SelectList
              parentId={this.props.note.id} type={'Tags'}
              selectedItems={this.props.note.tags}
              allItems={this.props.tags}
              add={this.props.actions.addTag}
              remove={this.props.actions.removeTag} />
          </div>
          {this.renderContent()}
        </div>
      </div>
    )
  }

  render () {
    window.SCROLLWITHKEYS = true
    if (this.state.editing) window.SCROLLWITHKEYS = false
    return this.renderNote()
  }
}

NoteView.propTypes = {
  note: PropTypes.object.isRequired,
  characters: PropTypes.array.isRequired,
  places: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
}

function mapStateToProps (state) {
  return {
    characters: state.characters,
    places: state.places,
    tags: state.tags
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(NoteActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NoteView)
