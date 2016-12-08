import React from 'react';

let Utils = {
  to_time_format: function(s) {
    s = s + '';
    var l = (s + '').length;
    if (l == 1) return '0' + s;
    else if (l == 2) return s;
    else return '00';
  },
  //当前时间，24h
  current_time: function(d) {
    if (d == null || d == 'undefine') {
      d = new Date();
    }
    return this.to_time_format(d.getHours()) + ':' + this.to_time_format(d.getMinutes()) + ':' + this.to_time_format(d.getSeconds());
  },
  sec_2_hour: function(sec) {
    var h = parseInt(sec / 3600);
    var m = parseInt((sec - h * 3600) / 60)
    var s = sec - h * 3600 - m * 60;
    return h + ':' + m + ':' + s;
  }
}

export default Utils;