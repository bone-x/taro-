
import { SAW } from '../constants/agreement'

const INITIAL_STATE = {
  saw: false
}

export default function counter (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SAW:
      return {
        ...state,
        saw:action.payload
      }
    default:
      return state
  }
}