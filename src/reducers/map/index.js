/**
 * @file Reducer function for handling the part of the state object that
 * stores the state of the map, its selection, the list of layers and so
 * on.
 */

import { combineReducers } from 'redux'

import layersReducer from './layers'
import selectionReducer from './selection'
import toolsReducer from './tools'

/**
 * The reducer function that is responsible for handling all map-related
 * parts in the global state object.
 */
const reducer = combineReducers({
  layers: layersReducer,
  selection: selectionReducer,
  tools: toolsReducer
})

export default reducer