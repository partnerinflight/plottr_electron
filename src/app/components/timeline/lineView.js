import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import PureComponent from 'react.pure.component'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Glyphicon, Button, Input, ButtonGroup } from 'react-bootstrap'
import * as LineActions from 'actions/lines'
import CardView from 'components/timeline/cardView'
import ColorPicker from '../colorpicker'
import orientedClassName from 'helpers/orientedClassName'

class LineView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      hovering: false,
      editing: props.line.title === '',
      dragging: false,
      dropping: false,
      showColorPicker: false
    }
  }

  findCard (sceneId) {
    return _.find(this.cards(), {sceneId: sceneId})
  }

  lineLength () {
    let multiplier = this.width()
    if (this.props.orientation === 'vertical') {
      multiplier = this.verticalHeight()
    }
    return this.numberOfScenes() * multiplier + 25
  }

  numberOfScenes () {
    return this.props.scenes.length + 1 // + 2 because of the placeholder and the new (hidden) beats
  }

  height () {
    return 66 / 2
  }

  verticalHeight () {
    return 66 + 25
  }

  width () {
    return 150 + 25
  }

  widthForVertical () {
    return 75
  }

  cards () {
    var cards = _.filter(this.props.cards, (card) => {
      return card.lineId === this.props.line.id
    })
    return _.sortBy(cards, 'position')
  }

  editTitle = () => {
    var id = this.props.line.id
    var newTitle = this.refs.titleInput.getValue()
    this.props.actions.editLineTitle(id, newTitle)
    this.setState({editing: false})
  }

  handleFinishEditingTitle = (event) => {
    if (event.which === 13) {
      this.editTitle()
    }
  }

  handleBlur = () => {
    if (this.refs.titleInput.getValue() !== '') {
      this.editTitle()
      this.setState({editing: false})
    }
  }

  handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/json', JSON.stringify(this.props.line))
    this.setState({dragging: true})
  }

  handleDragEnd = () => {
    this.setState({dragging: false})
  }

  handleDragEnter = (e) => {
    this.setState({dropping: true})
  }

  handleDragOver = (e) => {
    e.preventDefault()
    return false
  }

  handleDragLeave = (e) => {
    this.setState({dropping: false})
  }

  handleDrop = (e) => {
    e.stopPropagation()
    this.handleDragLeave()

    var json = e.dataTransfer.getData('text/json')
    var droppedLine = JSON.parse(json)
    if (!droppedLine.id) return

    this.props.handleReorder(this.props.line.position, droppedLine.position)
  }

  handleDelete = () => {
    if (window.confirm(`Do you want to delete this story line: '${this.props.line.title}'?`)) {
      this.props.actions.deleteLine(this.props.line.id)
    }
  }

  filterIsEmpty () {
    let filter = this.props.filteredItems
    return filter == null ||
      (filter['tag'].length === 0 &&
      filter['character'].length === 0 &&
      filter['place'].length === 0)
  }

  cardIsFiltered (card) {
    if (!card) return false
    const filter = this.props.filteredItems
    if (filter == null) return true
    var filtered = true
    if (card.tags) {
      card.tags.forEach((tId) => {
        if (filter['tag'].indexOf(tId) !== -1) filtered = false
      })
    }
    if (card.characters) {
      card.characters.forEach((cId) => {
        if (filter['character'].indexOf(cId) !== -1) filtered = false
      })
    }
    if (card.places) {
      card.places.forEach((pId) => {
        if (filter['place'].indexOf(pId) !== -1) filtered = false
      })
    }
    return filtered
  }

  changeColor = (newColor) => {
    if (newColor) {
      this.props.actions.editLineColor(this.props.line.id, newColor)
    }
    this.setState({showColorPicker: false})
  }

  renderColorPicker () {
    if (this.state.showColorPicker) {
      var key = 'colorPicker-' + this.props.line.id
      return <ColorPicker key={key} color={this.props.line.color} closeDialog={this.changeColor} />
    } else {
      return null
    }
  }

  renderSVGLine () {
    let lineLength = this.lineLength()
    let style = {stroke: this.props.line.color}
    if (this.props.orientation === 'vertical') {
      return (<svg height={lineLength} >
        <line y1='0' x1={this.widthForVertical()} y2={lineLength} x2={this.widthForVertical()} className='line__svg-line' style={style} />
      </svg>)
    } else {
      return (<svg width={lineLength} >
        <line x1='0' y1={this.height()} x2={lineLength} y2={this.height()} className='line__svg-line' style={style} />
      </svg>)
    }
  }

  renderCards () {
    var sceneMap = this.props.sceneMap

    return Object.keys(sceneMap).map((scenePosition) => {
      var sceneId = sceneMap[scenePosition]
      var card = this.findCard(sceneId)
      var id = card ? card.id : 'blank' + sceneId + scenePosition
      var filtered = false
      if (!this.filterIsEmpty() && this.cardIsFiltered(card)) {
        filtered = true
      }
      return (<CardView key={id} card={card}
        sceneId={sceneId} lineId={this.props.line.id}
        labelMap={this.props.labelMap}
        color={this.props.line.color} filtered={filtered}
        isZoomed={this.props.isZoomed} zoomIn={this.props.zoomIn}
        zoomFactor={this.props.zoomFactor} />
      )
    })
  }

  renderHoverOptions () {
    var style = {visibility: 'hidden'}
    if (this.state.hovering) style.visibility = 'visible'
    if (this.props.orientation === 'vertical') {
      return (<div className={orientedClassName('line__hover-options', this.props.orientation)} style={style}>
        <ButtonGroup>
          <Button onClick={() => this.setState({editing: true})}><Glyphicon glyph='edit' /></Button>
          <Button onClick={() => this.setState({showColorPicker: true})}><Glyphicon glyph='tint' /></Button>
          <Button onClick={this.handleDelete}><Glyphicon glyph='trash' /></Button>
        </ButtonGroup>
      </div>)
    } else {
      return (<div className='line__hover-options' style={style}>
        <Button block onClick={() => this.setState({editing: true})}><Glyphicon glyph='edit' /></Button>
        <Button block onClick={() => this.setState({showColorPicker: true})}><Glyphicon glyph='tint' /></Button>
        <Button block onClick={this.handleDelete}><Glyphicon glyph='trash' /></Button>
      </div>)
    }
  }

  renderBody () {
    var classes = 'line__body'
    if (this.state.hovering) classes += ' hover'
    var style = {}
    var zoomFactor = this.props.zoomFactor
    if (this.props.isZoomed && this.state.hovering) {
      switch(true) {
        case zoomFactor === 0.1:
          style.transform = 'scale(4, 4)';
          break;
        case zoomFactor > 0.1 && zoomFactor < 0.75:
          style.transform = 'scale(2, 2)';
          break;
        case zoomFactor >= 0.75:
          style.transform = 'scale(1, 1)'
          break;
        default:
          style.transform = 'scale(3, 3)' // This is for fit
      }
      style.transformOrigin = 'left center'
    }
    let titleClass = orientedClassName('line__title', this.props.orientation)
    var body = <div className={titleClass}>{this.props.line.title}</div>
    if (this.state.editing) {
      body = (<Input
        type='text'
        defaultValue={this.props.line.title}
        label='Story line name'
        ref='titleInput'
        autoFocus
        onKeyDown={(event) => {if (event.which === 27) this.setState({editing: false})}}
        onBlur={this.handleBlur}
        onKeyPress={this.handleFinishEditingTitle} />)
    }
    return (
      <div
        className={classes}
        style={style}
        onClick={() => this.setState({editing: true})}
        draggable={true}
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd}
        onDragEnter={this.handleDragEnter}
        onDragOver={this.handleDragOver}
        onDragLeave={this.handleDragLeave}
        onDrop={this.handleDrop}>
        {body}
        {this.renderColorPicker()}
      </div>
    )
  }

  render () {
    if (this.state.editing) {
      window.SCROLLWITHKEYS = false
    } else {
      window.SCROLLWITHKEYS = true
    }
    let lineLength = this.lineLength()
    let lineStyle = {width: (lineLength + this.width())}
    if (this.props.orientation === 'vertical') {
      lineStyle = {height: (lineLength + this.height())}
    }
    return (
      <div className={orientedClassName('line', this.props.orientation)}
        style={lineStyle}
        onMouseEnter={() => this.setState({hovering: true})}
        onMouseLeave={() => this.setState({hovering: false})} >
        {this.renderHoverOptions()}
        {this.renderBody()}
        <div className={orientedClassName('line__svg-line-box', this.props.orientation)}>
          {this.renderSVGLine()}
        </div>
        <div className={orientedClassName('card__box', this.props.orientation)}>
          {this.renderCards()}
        </div>
      </div>
    )
  }
}

LineView.propTypes = {
  line: PropTypes.object.isRequired,
  scenes: PropTypes.array.isRequired,
  sceneMap: PropTypes.object.isRequired,
  cards: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  handleReorder: PropTypes.func.isRequired,
  filteredItems: PropTypes.object,
  labelMap: PropTypes.object.isRequired,
  isZoomed: PropTypes.bool.isRequired,
  zoomFactor: PropTypes.any.isRequired,
  zoomIn: PropTypes.func.isRequired,
  orientation: PropTypes.string.isRequired
}

function mapStateToProps (state) {
  return {
    lines: state.lines,
    scenes: state.scenes,
    cards: state.cards,
    orientation: state.ui.orientation
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(LineActions, dispatch)
  }
}

const Pure = PureComponent(LineView)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pure)
