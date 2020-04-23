import {
  SAW
} from '../constants/agreement'

export const change = (status) => {
  return {
    type: SAW,
    payload:status
  }
}
// 异步的 action
export function changeAgreeStatus (status) {
  return dispatch => {
      dispatch(change(status))
  }
}