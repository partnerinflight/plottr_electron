import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Glyphicon } from 'react-bootstrap'
import CharacterView from 'components/notes/characterView'
import 'style!css!sass!css/character_list_block.css.scss'

class CharacterListView extends Component {

  handleCreateNewCharacter () {

  }

  renderCharacters () {
    return this.props.characters.map(ch =>
      <CharacterView key={ch.id} character={ch} />
    )
  }

  render () {
    return (
      <div className='character-list'>
        <h3>Characters</h3>
        {this.renderCharacters()}
        <div className='character-list__new' onClick={this.handleCreateNewCharacter.bind(this)} >
          <Glyphicon glyph='plus' />
        </div>
      </div>
    )
  }
}

CharacterListView.propTypes = {
  characters: PropTypes.array.isRequired
}

function mapStateToProps (state) {
  return {
    characters: state.characters
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CharacterListView)
