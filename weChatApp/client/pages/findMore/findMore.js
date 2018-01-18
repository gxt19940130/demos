var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        logged: false,
        indicatorDots: false,
        autoplay: true,
        vertical: true,
        interval: 5000,
        duration: 200,
        discussList: [],
        recFocusList: [],
        recHotList: [],
        showIndex: [],
        focusList: [],
        footerAuto: false,
        animationData: {},
        fadeData: {},
        showDrawerFlag: false,
        hotFocusList: [],
        scrollTop: 0
    },
    getUserInfo: function() {
        var that = this;
        wx.getStorage({
            key: 'userInfo',
            success(res) {
                that.setData({
                    userInfo: res.data,
                    logged: true
                });
            }
        })
    },
    getDiscussList: function() {
        var that = this;
        util.http('discussListApi', {}, (res) => {
            if (res.errMsg) {
                util.showModel(res.errMsg);
            } else {
                console.log('请求讨论列表');
                that.setData({
                    discussList: res.discussList || [],
                })
            }
        })
    },
    getRecFocusList: function() {
        var that = this;
        util.http('recFocusListApi', {}, (res) => {
            if (res.errMsg) {
                util.showModel(res.errMsg);
            } else {
                console.log('请求推荐关注列表');
                that.setData({
                    recFocusList: res.recFocusList || [],
                    focusList: []
                })
            }
        })
    },
    getRecHotList: function() {
        var that = this;
        util.http('recHotListApi', {}, (res) => {
            if (res.errMsg) {
                util.showModel(res.errMsg);
            } else {
                console.log('请求推荐热门列表');
                that.setData({
                    recHotList: res.hotList || []
                })
            }
        })
    },
    focusIt: function(e) {
        var that = this,
            index = e.target.dataset.index;
        wx.showToast({
            title: '关注成功',
            icon: 'success',
            duration: 2000
        })
        this.data.focusList[index] = !this.data.focusList[index];
        this.setData({
            focusList: this.data.focusList
        })
    },
    focusAll: function() {
        var that = this;
        wx.showToast({
            title: '关注成功',
            icon: 'success',
            duration: 2000
        })
        setTimeout(function() {
            that.getRecFocusList();
        }, 2000);
    },
    hotFocus: function(e) {
        var that = this,
            index = e.target.dataset.index;
        wx.showToast({
            title: '关注成功',
            icon: 'success',
            duration: 2000
        })
        this.data.hotFocusList[index] = !this.data.hotFocusList[index];
        this.setData({
            hotFocusList: this.data.hotFocusList
        })
    },
    toggleShow: function(e) {
        var that = this,
            index = e.target.dataset.index;
        this.data.showIndex[index] = !this.data.showIndex[index];
        this.setData({
            showIndex: this.data.showIndex
        })
    },
    toggleDrawer: function(){
        this.setData({
            showDrawerFlag: !this.data.showDrawerFlag
        })
        var animation = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease-out',
            delay: 0
        })
        // var fade = wx.createAnimation({
        //     duration: 1000,
        //     timingFunction: 'ease-out',
        //     delay: 0
        // })
        // this.data.showDrawerFlag ? fade.opacity(0).step({delay: 500}) : fade.opacity(1).step();
        this.data.showDrawerFlag ? animation.bottom(0).step() : animation.bottom(-100 + '%').step();
        // 设置动画
        this.setData({
            animationData: animation.export()
        })
    },
    onScroll: function (e) {
        this.setData({
            scrollTop: e.detail.scrollTop
        })
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    onReady: function() {
        this.getUserInfo();
        this.getDiscussList();
        this.getRecFocusList();
        this.getRecHotList();
    }
})