var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        logged: false,
        scorllTop: 0,
        messageHeader: '',
        messageList: []
    },
    getUserInfo: function() {
        var that = this;
        wx.getStorage({
            key: 'userInfo',
            success (res) {
                that.setData({
                    userInfo: res.data,
                    logged: true
                });
            }
        })
    },
    getUserCenterList: function() {
        var that = this;
        util.http('messageListApi', {}, (res) => {
            if(res.errMsg) {
                util.showModel(res.errMsg);
            } else {
                console.log('请求消息列表');
                that.setData({
                    messageHeader: res.data.messageHeader || '',
                    messageList: res.data.messageList || []
                })
            }
        })
    },
    onScroll: function(e) {
      this.setData({
        scorllTop: e.detail.scrollTop
      })
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    onPullDownRefresh: function(){
        wx.stopPullDownRefresh();
    },
    onReady: function() {
        this.getUserInfo();
        this.getUserCenterList();
    }
})