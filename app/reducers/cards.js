import { ADD_CARD, EDIT_CARD_TITLE, EDIT_CARD_DESCRIPTION,
  CHANGE_LINE, CHANGE_SCENE, EDIT_CHARACTERS, EDIT_TAGS, EDIT_PLACES, FILE_LOADED } from '../constants/ActionTypes'

const initialState = [{
  id: 0,
  lineId: 0,
  sceneId: 0,
  title: '',
  description: '',
  tags: [],
  characters: [],
  places: []
}]

export default function cards (state = initialState, action) {
  switch (action.type) {
    case ADD_CARD:
      return [{
        id: state.reduce((maxId, card) => Math.max(card.id, maxId), -1) + 1,
        lineId: action.lineId,
        sceneId: action.sceneId,
        title: action.title,
        description: action.description,
        tags: action.tags,
        characters: action.characters,
        places: action.places
      }, ...state]

    case EDIT_CARD_TITLE:
      return state.map(card =>
        card.id === action.id ? Object.assign({}, card, {title: action.title}) : card
      )

    case EDIT_CARD_DESCRIPTION:
      return state.map(card =>
        card.id === action.id ? Object.assign({}, card, {description: action.description}) : card
      )

    case CHANGE_LINE:
      return state.map(card =>
        card.id === action.id ? Object.assign({}, card, {lineId: action.lineId}) : card
      )

    case CHANGE_SCENE:
      return state.map(card =>
        card.id === action.id ? Object.assign({}, card, {sceneId: action.sceneId}) : card
      )

    case EDIT_CHARACTERS:
      return state.map(card =>
        card.id === action.id ? Object.assign({}, card, {characters: action.characters}) : card
      )

    case EDIT_TAGS:
      return state.map(card =>
        card.id === action.id ? Object.assign({}, card, {tags: action.tags}) : card
      )

    case EDIT_PLACES:
      return state.map(card =>
        card.id === action.id ? Object.assign({}, card, {places: action.places}) : card
      )

    case FILE_LOADED:
      return action.data.cards

    default:
      return state
  }
}
