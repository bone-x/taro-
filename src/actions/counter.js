/*
 * @Author: 邓达
 * @Description:
 * @props:
 * @event:
 * @Date: 2020-02-11 15:11:09
 * @LastEditors: 邓达
 * @LastEditTime: 2020-02-17 15:32:08
 */
import { ADD, MINUS } from "../constants/counter";

export const add = () => {
  return {
    type: ADD
  };
};
export const minus = () => {
  return {
    type: MINUS
  };
};

// 异步的action
export function asyncAdd() {
  return dispatch => {
    setTimeout(() => {
      dispatch(add());
    }, 2000);
  };
}
