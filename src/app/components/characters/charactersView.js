import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import CharacterListView from 'components/characters/characterListView'

class CharactersView extends Component {

  render () {
    return (
      <div className='characters-view'>
        <CharacterListView />
      </div>
    )
  }
}

CharactersView.propTypes = {}

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CharactersView)
