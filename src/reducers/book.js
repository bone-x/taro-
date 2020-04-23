import { BOOKID } from '../constants/book'

const INITIAL_STATE = {
  bookId: null
}

export default function bookReducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case BOOKID:
      return {
        ...state,
        bookId: action.payload
      }
     default:
       return state
  }
}
