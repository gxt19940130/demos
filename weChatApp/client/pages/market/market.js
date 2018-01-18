var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        interval: 5000,
        duration: 500,
        indicator: false,
        autoplay: true,
        bannerList: [],
        iconList: [],
        adInfo: {},
        // liveList: [],
        // partLength: 0,
        newsList: [],
        lessonList: [],
        partList: [],
        specialList: [],
        bookList: [],
        scrollBanner: [],
        guessList: [],
        scoreList: [0, 1, 2, 3, 4]
    },
    getMarketList: function() {
        var that = this;
        util.http('marketListApi', {}, (res) => {
            if (res.errMsg) {
                util.showModel(res.errMsg);
            } else {
                console.log('请求市场列表');
                that.setData({
                    bannerList: res.bannerList || [],
                    iconList: res.iconList || [],
                    adInfo: res.adInfo || {},
                    // liveList: res.liveList || [],
                    // partLength: Math.floor(res.liveList / 2)
                    newsList: res.newsList || [],
                    lessonList: res.lessonList || [],
                    partList: res.partList || [],
                    specialList: res.specialList || [],
                    bookList: res.bookList || [],
                    scrollBanner: res.scrollBanner || [],
                    guessList: res.guessList || [],
                })
            }
        })
    },
    getMoreMarketList() {
        var that = this;
        that.data.guessList.length < 50 && util.http('marketListApi', {}, (res) => {
            !res.errMsg ? that.setData({ guessList: that.data.guessList.concat(res.guessList) })
                        : util.showModel(res.errMsg);
            console.log('请求更多猜你喜欢列表数据');
        })
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
       this.getMoreMarketList();
    },
    onReady: function() {
        this.getMarketList();
    }
})