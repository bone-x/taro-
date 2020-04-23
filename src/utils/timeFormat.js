/**
 *
 * @param {Number} timestamp
 * @description 资讯模块时间格式转换
 * @example
 *
 * timestampFormat(new Date().getTime())
 *
 */
export function timestampFormat( timestamp ) {
  function zeroize( num ) {
      return (String(num).length === 1 ? '0' : '') + num;
  }

  let curTimestamp = parseInt(new Date().getTime()); //当前时间戳
  let timestampDiff = ( curTimestamp - timestamp ) / 1000; // 参数时间戳与当前时间戳相差秒数

  let tmDate = new Date( timestamp );  // 参数时间戳转换成的日期对象

  let Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();

  if ( timestampDiff < 5 * 60 ) { // 5分钟内
      return "刚刚";
  } else if( timestampDiff < 60 * 60 ) { // t分钟前
      return Math.floor( timestampDiff / 60 ) + "分钟前";
  }
  else if (timestampDiff < 24 * 60 * 60) { // t小时前
      return Math.floor( timestampDiff / (60 * 60))
  } else {
      return  `${Y} - ${zeroize(m)} - ${zeroize(d)}`
  }
}

export function setCookie(name,value){
  var exp  = new Date();
  exp.setTime(exp.getTime() + 30*24*60*60*1000);
  document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
export function getCookie(name) {
  var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
  if (arr != null) return unescape(arr[2]);
  return null;
}

export function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null) {
      document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    }
}

/**
 *
 * @param {number} time
 * @param {function} cb
 * @description 倒计时
 * @example
 *
 * countDown(2172716271, (leftTime)=>{
 *    // leftTime => '01 : 25 : 12'(时 ：分：秒)
 *    this.setState({leftTime})
 * })
 *
 */
export function countDown (time, cb) {
  function zeroize( num ) {
    return (String(num).length === 1 ? '0' : '') + num;
  }
  /**
   *
   * @param {num} t
   * @description 格式化返回时间
   */
  function formatLeftTime (t) {
    if (t === 0) {
      return '00 : 00 : 00'
    }
    t = new Date(t * 1000)
    let h = t.getHours(), m = t.getMinutes(), s = t.getSeconds();
    return `${zeroize(m)} : ${zeroize(s)}`
  }

  function verifyType (obj, type) {
    return Object.prototype.toString.call(obj) === `[object ${type}]`
  }

  let timer = null
  let leftTime = Math.floor(new Date(time).getTime() / 1000)

  timer = () => setTimeout(_ => {
      if (leftTime === 0) {
        clearTimeout(timer)
        timer = null
      } else {
        leftTime --
        timer()
        cb(formatLeftTime(leftTime))
      }
    }, 1000)

  verifyType(cb, 'Function') && timer()
}

export function format(value, fmt) {
  if (!value || value == undefined || value == '' || value == null) return ''
  value = isNaN(Number(value)) ? value.replace(/-/g, '/') :Number(value)
  let date = new Date(value)
  var o = {
    "M+" : date.getMonth()+1,                 //月份
    "d+" : date.getDate(),                    //日
    "h+" : date.getHours(),                   //小时
    "m+" : date.getMinutes(),                 //分
    "s+" : date.getSeconds(),                 //秒
    "q+" : Math.floor((date.getMonth()+3)/3), //季度
    "S"  : date.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt)) {
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  for(var k in o) {
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return fmt;
}
