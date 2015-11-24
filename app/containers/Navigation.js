import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as UIActions from '../actions/ui'
import $ from 'jquery'
import { Button } from 'react-bootstrap'

class Navigation extends Component {
  constructor (props) {
    super(props)
    this.state = {editing: false}
  }

  render () {
    return (
      <div>
        <nav className='navbar navbar-default navbar-fixed-top' role='navigation'>
          <div className='navbar-header'>
            <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='#navbar-collapse-1'>
              <span className='sr-only'>Toggle navigation</span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
            </button>
            {this.renderStoryName()}
          </div>
          <div className='collapse navbar-collapse'>
            <ul className='nav navbar-nav'>
              <li className={this.isActive('timeline')}>
                <a href='#' onClick={() => this.props.actions.changeCurrentView('timeline')} >Timeline</a>
              </li>
              <li className={this.isActive('notes')}>
                <a href='#' onClick={() => this.props.actions.changeCurrentView('notes')} >Notes</a>
              </li>
              <li className={this.isActive('outline')}>
                <a href='#' onClick={() => this.props.actions.changeCurrentView('outline')} >Outline</a>
              </li>
              <li className={this.isActive('slides')}>
                <a href='#' onClick={() => this.props.actions.changeCurrentView('slides')} >Slides</a>
              </li>
            </ul>
            <p className='navbar-text navbar-right' style={{marginRight: '15px'}}>
              <span className='label label-warning'>{this.props.file.dirty ? 'unsaved changes' : ''}</span>
            </p>
          </div>
        </nav>
      </div>
    )
  }

  saveEdit (event) {
    var newName = $(event.target).parent().find('input').val()
    this.props.actions.changeStoryName(newName)
    this.setState({editing: false})
  }

  renderStoryName () {
    return this.state.editing ? this.renderEditingStoryName() : this.renderNormalStoryName()
  }

  renderEditingStoryName () {
    return (<div><input className='input' type='text' placeholder={this.props.storyName} autoFocus='true' />
      <Button bsStyle='primary' onClick={this.saveEdit.bind(this)} >save</Button>
    </div>)
  }

  renderNormalStoryName () {
    return <a className='navbar-brand' onClick={() => this.setState({editing: true})} >{this.props.storyName}</a>
  }

  isActive (currentLink) {
    if (currentLink === this.props.currentView) {
      return 'active'
    }
  }
}

Navigation.propTypes = {
  storyName: PropTypes.string.isRequired,
  currentView: PropTypes.string.isRequired,
  file: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}

function mapStateToProps (state) {
  return {
    file: state.file,
    storyName: state.storyName,
    currentView: state.ui.currentView
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(UIActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation)