import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class AddCard extends Component {

  render () {
    const item = this.props.item
    return (
      <div>
        <span>new card</span>
      </div>
    )
  }
}

AddCard.propTypes = {
  item: PropTypes.object.isRequired
}

function mapStateToProps (state) {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddCard)
