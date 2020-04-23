/*
 * @Author: 邓达
 * @Description:
 * @props:
 * @event:
 * @Date: 2020-02-11 15:11:09
 * @LastEditors  : 邓达
 * @LastEditTime : 2020-02-13 17:58:17
 */
import login from "./login";
import live from "./live";
import test from "./test";
import book from "./book";
import honour from "./honour";
import zipper from "./zipper";
import course from "./course";
import report from "./report";

export default {
  ...live,
  ...test,
  ...login,
  ...test,
  ...book,
  ...honour,
  ...zipper,
  ...course,
  ...report
};
