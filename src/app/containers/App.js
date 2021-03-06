import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Navigation from 'containers/Navigation'
import Body from 'containers/Body'
import * as UIActions from 'actions/ui'

class App extends Component {
  render () {
    return (
      <div>
        <Navigation />
        <Body />
      </div>
    )
  }
}

App.propTypes = {
  file: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}

function mapStateToProps (state) {
  return {
    file: state.file
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
)(App)
