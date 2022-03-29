const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const getDate = tm => {
  var tt = new Date(parseInt(tm)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, "        ")
  return tt;
}

function kmUnit(m) {
  var v;
  if (typeof m === 'number' && !isNaN(m)) {
    if (m >= 1000) {
      v = (m / 1000).toFixed(2) + 'km'
    } else {
      v = m + 'm'
    }
  } else {
    v = '0m'
  }
  return v;
}

const MAX_VALUE = 10;
/**
 * 解除小程序页面10层限制
 * @param obj
 */
export function unfreezeNavigateTo(obj) {
  let pages = getCurrentPages(),  // 页面栈
      len = pages.length,
      dlt = '',
      url = '/' + obj.url.replace(/^\//, ''); // 如果有，将第一个‘/’去掉，然后再补上
      console.log(pages)
  // 查找目标页在页面栈的位置
  for (let i = 0; i < len; i++) {
    if (pages[i].route == url) {
      dlt = i + 1; //目标页在栈中的位置
      break;
    }
  }
  // 保存数据
  if (!dlt) { //页面不在栈中
    if (len < MAX_VALUE) {
      wx.navigateTo({
        url
      });
    } else {
      wx.redirectTo({
        url
      });
    }
  } else {
    wx.navigateBack({
      delta: len - dlt
    });
  }
}

module.exports = {
  formatTime,
  getDate,
  kmUnit,
  unfreezeNavigateTo
}