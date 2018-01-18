var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        logged: false,
        privateList: [],
        walletList: [],
        controlList: [],
        userCenterList: []
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
        util.http('userListApi', {}, (res) => {
            if(res.errMsg) {
                util.showModel(res.errMsg);
            } else {
                console.log('请求个人中心列表');
                that.setData({
                    privateList: res.privateList || [],
                    walletList: res.walletList || [],
                    controlList: res.controlList || [],
                    userCenterList: [res.privateList].concat([res.walletList], [res.controlList])
                })
            }
        })
    },
    onPullDownRefresh: function(){
        wx.stopPullDownRefresh();
    },
    onReady: function() {
        this.getUserInfo();
        this.getUserCenterList();
    }
})