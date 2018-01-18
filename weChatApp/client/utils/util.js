var env = 'development';
var api = require('./api.config.js');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    })
}

// 请求
var http = (url, data, fun) => {
  wx.request({
    method: 'POST',
    url: api[url][env],
    data: data,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function(res) {
      console.log(res.errMsg)
      res.statusCode === 200 ? fun(res.data) : fun(res);
    },
    fail: function(res) {
      console.log(res.statusCode, res.errMsg)
    }
  })
}

module.exports = { formatTime, showBusy, showSuccess, showModel, http }
