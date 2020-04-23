/*
 * @Author: 邓达
 * @Description:
 * @props:
 * @event:
 * @Date: 2020-02-11 15:11:09
 * @LastEditors: 邓达
 * @LastEditTime: 2020-02-18 17:24:51
 */
import { combineReducers } from "redux";
import counter from "./counter";
import loginReducer from "./login";
import agreement from "./agreement";
import course from "./course";
import oraltitle from "./oraltitle";

export default combineReducers({
  counter,
  loginReducer,
  agreement,
  course,
  oraltitle
});
