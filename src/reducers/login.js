/*
 * @Author: 邓达
 * @Description:
 * @props:
 * @event:
 * @Date: 2020-02-17 15:35:13
 * @LastEditors: 邓达
 * @LastEditTime: 2020-02-17 15:35:13
 */
import { LOGIN, CHANGELOGINLOADING } from "../constants/login";

const INITIAL_STATE = {
  openId: null,
  token: null,
  loading: false
};
const Login = (state, token) => {
  return {
    token: token
  };
};

export default function loginReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        ...Login(state, action.user)
      };
    case CHANGELOGINLOADING:
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
}
