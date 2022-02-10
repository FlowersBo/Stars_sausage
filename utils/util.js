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


module.exports = {
  formatTime,
  getDate
}