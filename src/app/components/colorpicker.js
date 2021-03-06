import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import { reds, oranges, greens, blues, purples, grays, whites, browns } from '../constants/CSScolors'
import { Input, Button, Row, Col } from 'react-bootstrap'

const customStyles = {content: {top: '70px'}}

class ColorPicker extends Component {
  constructor (props) {
    super(props)
    this.state = {color: this.props.color}
  }

  closeDialog = (color = null) => {
    this.props.closeDialog(color)
  }

  showColor = () => {
    var newColor = this.refs.hex.getValue()
    var regex = /#?([0123456789abcdef]{6})/
    var matches = regex.exec(newColor)
    if (matches) {
      this.setState({color: `#${matches[1]}`})
    } else {
      this.setState({color: newColor})
    }
  }

  render () {
    return (<Modal isOpen={true} onRequestClose={this.closeDialog} style={customStyles}>
      <h2 className='color-picker__title'>Pick a color</h2>
      <div className='color-picker__input-box form-horizontal'>
        <Row>
          <Col xs={5} >
            <h5 style={{marginTop: '26px'}} className='secondary-text'>Click on a color below or type it in</h5>
          </Col>
          <Col xs={2} >
            <p style={{textAlign: 'right', marginTop: '32px'}}>Current Color: </p>
          </Col>
          <Col xs={1} >
            <div title={this.state.color} style={{backgroundColor: this.state.color, marginTop: '16px'}} className='color-picker__show-color'></div>
          </Col>
          <Col xs={2}>
            <Input type='text' label='hex code or name' ref='hex' placeholder='e.g. #ffffff'
              defaultValue={this.state.color}
              onKeyDown={(event) => {if (event.which === 27) this.closeDialog(this.state.color)}}
              onKeyPress={(event) => {if (event.which === 13) this.closeDialog(this.state.color)}}
              onChange={this.showColor} />
          </Col>
          <Col xs={2}>
            <div style={{marginTop: '26px'}}>
              <Button bsStyle='success' onClick={() => this.closeDialog(this.state.color)}>Choose</Button>
            </div>
          </Col>
        </Row>
      </div>
      <div>
        {this.renderColors()}
      </div>
    </Modal>)
  }

  renderColors () {
    return <div className='color-picker__box-wrapper'>
      <p>Reds</p>
      <div className='color-picker__box'>
        {reds.map(c => <div key={'color-picker-color-' + c} className='color-picker__choice'>{this.renderColor(c)}</div>)}
      </div>
      <p>Oranges</p>
      <div className='color-picker__box'>
        {oranges.map(c => <div key={'color-picker-color-' + c} className='color-picker__choice'>{this.renderColor(c)}</div>)}
      </div>
      <p>Greens</p>
      <div className='color-picker__box'>
        {greens.map(c => <div key={'color-picker-color-' + c} className='color-picker__choice'>{this.renderColor(c)}</div>)}
      </div>
      <p>Blues</p>
      <div className='color-picker__box'>
        {blues.map(c => <div key={'color-picker-color-' + c} className='color-picker__choice'>{this.renderColor(c)}</div>)}
      </div>
      <p>Purples</p>
      <div className='color-picker__box'>
        {purples.map(c => <div key={'color-picker-color-' + c} className='color-picker__choice'>{this.renderColor(c)}</div>)}
      </div>
      <p>Grays</p>
      <div className='color-picker__box'>
        {grays.map(c => <div key={'color-picker-color-' + c} className='color-picker__choice'>{this.renderColor(c)}</div>)}
      </div>
      <p>Whites</p>
      <div className='color-picker__box'>
        {whites.map(c => <div key={'color-picker-color-' + c} className='color-picker__choice'>{this.renderColor(c)}</div>)}
      </div>
      <p>Browns</p>
      <div className='color-picker__box'>
        {browns.map(c => <div key={'color-picker-color-' + c} className='color-picker__choice'>{this.renderColor(c)}</div>)}
      </div>
    </div>
  }

  renderColor (color) {
    return <Button title={color} onClick={() => this.closeDialog(color)} style={{backgroundColor: color}}></Button>
  }
}

ColorPicker.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  color: PropTypes.string
}

export default ColorPicker
