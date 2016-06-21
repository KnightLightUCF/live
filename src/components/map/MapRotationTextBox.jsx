/**
 * @file React Component to display and adjust the rotation of the map view.
 */

import React from 'react'

import Rotate from 'material-ui/svg-icons/image/rotate-right'
import TextField from 'material-ui/TextField'

/**
 * React Component to display and adjust the rotation of the map view.
 *
 * @property {string} fieldWidth the width of the actual input field
 * @property {string} style styling of the outermost element (a div)
 * @property {Object} Object containing signals for requesting
 * and sending map references.
 */
export default class MapRotationTextBox extends React.Component {
  /**
   * Constructor that sets initial state, binds context to functions,
   * adds signal event handler and requests map reference.
   *
   * @param {Object} props properties of the react tomponent
   * @property {string} fieldWidth the width of the actual input field
   * @property {string} style styling of the outermost element (a div)
   * @property {Object} mapReferenceSignals Object containing signals for requesting
   * and sending map references.
   *
   * @emits {mapReferenceRequest} requests map reference.
   */
  constructor (props) {
    super(props)
    this.state = {
      isFocused: false,
      rotation: 0
    }

    this.onMapReferenceReceived_ = this.onMapReferenceReceived_.bind(this)
    this.updateFromMap_ = this.updateFromMap_.bind(this)
    this.onFocus_ = this.onFocus_.bind(this)
    this.onBlur_ = this.onBlur_.bind(this)
    this.handleChange_ = this.handleChange_.bind(this)

    const {mapReferenceSignals} = props
    mapReferenceSignals.mapReferenceResponse.add(this.onMapReferenceReceived_)
    mapReferenceSignals.mapReferenceRequest.dispatch()
  }

  render () {
    return (
      <div style={this.props.style}>
        <Rotate style={{ margin: '12px' }} />
        <TextField
          style={{ width: this.props.fieldWidth, verticalAlign: 'inherit' }}
          hintText="Rotation"
          type="number"
          value={
            this.state.isFocused
            ? this.state.rotation
            : (this.state.rotation % 360).toFixed(2)
          }
          onFocus={this.onFocus_}
          onBlur={this.onBlur_}
          onChange={this.handleChange_} />
      </div>
    )
  }

  /**
   * Event handler for receiving the map reference.
   * Attaches event handlers to the map and it's view.
   *
   * @listens {mapReferenceResponse} listens for map references being sent.
   *
   * @param {ol.Map} map the map to attach the event handlers to
   */
  onMapReferenceReceived_ (map) {
    this.map = map

    map.getView().on('propertychange', this.updateFromMap_)

    map.on('propertychange', (e) => {
      if (e.key === 'view') {
        map.getView().on('propertychange', this.updateFromMap_)
      }
    })
  }

  /**
   * Event handler that processes and updates the state from the map.
   *
   * @param {ol.ObjectEvent} e the event fired from the OpenLayers View
   */
  updateFromMap_ (e) {
    if (e.key === 'rotation') {
      this.setState({
        rotation: e.target.get('rotation') / (Math.PI / 180)
      })
    }
  }

  /**
   * Event handler that sets the component's state according to the focus,
   * and normalizes it's value.
   */
  onFocus_ () {
    this.setState({
      isFocused: true,
      rotation: (this.state.rotation % 360).toFixed(2)
    })
  }

  /**
   * Event handler that unsets the component's focused state on blur.
   */
  onBlur_ () {
    this.setState({
      isFocused: false
    })
  }

  /**
   * Event handler that processes input from the TextField component.
   *
   * @param {Event} e the event fired from the TextField React component
   */
  handleChange_ (e) {
    // Maybe this should be done in componentWill/DidUpdate, but it causes feedback loop
    this.map.getView().setRotation(e.target.value * (Math.PI / 180))

    this.setState({
      rotation: e.target.value
    })
  }
}

MapRotationTextBox.propTypes = {
  fieldWidth: React.PropTypes.string,
  style: React.PropTypes.object
}
