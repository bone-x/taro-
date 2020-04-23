module.exports = {
  /**
   * 时间差
   * @param {*} date1 小的时间
   * @param {*} date2 大的时间
   */
  DateDiff: function(date1,date2){
    var s1 = date1.getTime(),s2 = date2.getTime();

    var total = (s2 - s1)/1000;

    var day = parseInt(total / (24*60*60));//计算整数天数

    var afterDay = total - day*24*60*60;//取得算出天数后剩余的秒数

    var hour = parseInt(afterDay/(60*60));//计算整数小时数

    var afterHour = total - day*24*60*60 - hour*60*60;//取得算出小时数后剩余的秒数

    var min = parseInt(afterHour/60);//计算整数分

    var afterMin = total - day*24*60*60 - hour*60*60 - min*60;//取得算出分后剩余的秒数

    return [ hour , min , parseInt(afterMin)]
  },

  /**
   * 计算剩余时间
   * @param time 时间戳 （必填）
   */
  passTime: function(time) {
    var nowTimestamp = Date.parse(new Date())
    var passTime = (time - nowTimestamp) / 1000
    return passTime
  },
  /**
   * 格式化时间戳
   * @param time 时间戳 （必填）
   * @param type 返回的格式 （必填）
   */
  formatDate: function(time, type) {
    var formatDate = new Date(time)
    var year = formatDate.getFullYear()
    var month = formatDate.getMonth() + 1
    var date = formatDate.getDate()
    var hour = formatDate.getHours()
    var minute = formatDate.getMinutes()
    var second = formatDate.getSeconds()
    var millisecond = formatDate.getMilliseconds()
    var pass_time = ''

    if (month < 10) {
      month = '0' + month
    }
    if (date < 10) {
      date = '0' + date
    }
    if (hour < 10) {
      hour = '0' + hour
    }
    if (minute < 10) {
      minute = '0' + minute
    }
    if (second < 10) {
      second = '0' + second
    }

    if (type == 1) {
      pass_time = year.toString() + month.toString() + date.toString()
    } else if (type == 2) {
      pass_time =
        year.toString() +
        '年' +
        month.toString() +
        '月' +
        date.toString() +
        '日' +
        hour.toString() +
        ':' +
        minute.toString()
    } else if (type == 3) {
      pass_time = hour.toString() + ':' + minute.toString()
    } else if (type == 4) {
      pass_time =
        year.toString() +
        month.toString() +
        date.toString() +
        hour.toString() +
        minute.toString() +
        second.toString()
    } else {
      pass_time =
        year.toString() +
        month.toString() +
        date.toString() +
        hour.toString() +
        minute.toString() +
        second.toString() +
        millisecond.toString()
    }
    return pass_time
  },
  /**
   * 倒计时
   * @param num 秒 （必填）
   * @callback 回调函数
   */
  countDown: function(num, callback, stopCallback) {
    var timer = setInterval(function() {
      var day = 0,
        hour = 0,
        minute = 0,
        second = 0 //时间默认值
      if (num > 0) {
        day = Math.floor(num / 86400)
        hour = Math.floor(num / 3600) - day * 24
        minute = Math.floor(num / 60) - day * 24 * 60 - hour * 60
        second =
          Math.floor(num) - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60
      } else {
        clearInterval(timer)
        typeof stopCallback === 'function' && stopCallback()
      }
      if (hour <= 9) hour = '0' + hour
      if (minute <= 9) minute = '0' + minute
      if (second <= 9) second = '0' + second

      typeof callback === 'function' && callback(day, hour, minute, second)
      num--
    }, 1000)
  },
  form: {
    /*
     * 判断是否是正确的手机号，以及手机的运营商
     * @param {String} num
     * 返回值:
     *      0 不是手机号码
     *      1 移动
     *      2 联通
     *      3 电信
     *      4 虚拟电话
     *      5 未知电话
     */
    isPhoneNum: function(num) {
      var flag = 0
      var phoneRe = /^1\d{10}$/
      //电信
      var dx = [133, 153, 177, 180, 181, 189]
      //联通
      var lt = [130, 131, 132, 145, 155, 156, 176, 185, 186]
      //移动
      var yd = [
        134,
        135,
        136,
        137,
        138,
        139,
        147,
        150,
        151,
        152,
        157,
        158,
        159,
        178,
        182,
        183,
        184,
        187,
        188
      ]
      //虚拟
      var xn = [170]

      function inArray(val, arr) {
        for (var i = 0; i < arr.length; i++) {
          if (val == arr[i]) return true
        }
        return false
      }

      if (phoneRe.test(num)) {
        var temp = num.slice(0, 3)
        if (inArray(temp, yd)) return 1
        if (inArray(temp, lt)) return 2
        if (inArray(temp, dx)) return 3
        if (inArray(temp, xn)) return 4
        return 5
      }
      return flag
    }
  }
}
