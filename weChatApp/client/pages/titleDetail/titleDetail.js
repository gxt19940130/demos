var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        logged: false,
        scorllTop: 0,
        questionTitle: '',
        title: '',
        describe: '',
        answerNumber: '',
        answerList: [],
        loadMore: '加载更多',
        isLoading: false,
    },
    getDetailList: function() {
        var that = this;
        util.http('titleDetailApi', {}, (res) => {
            if(res.errMsg) {
                util.showModel(res.errMsg);
            } else {
                console.log('请求提问详情列表');
                that.setData({
                    title: res.data.title || '',
                    describe: res.data.describe || '',
                    answerNumber: res.data.answerNumber || '',
                    answerList: res.data.answerList || []
                })
            }
        })
    },
    // 加载更多
    getMoreDetailList() {
        var that = this;
        this.setData({
            isLoading: true,
            loadMore: '正在加载...'
        })
        util.http('titleDetailApi', {}, (res) => {
            !res.errMsg ? that.setData({ answerList: that.data.answerList.concat(res.data.answerList) })
                        : util.showModel(res.errMsg);
            console.log('请求更多回答列表数据');
            this.setData({
                isLoading: false,
                loadMore: '加载更多'
            })
        })
    },
    onPullDownRefresh: function(){
        wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
        this.getMoreDetailList();
    },
    onLoad: function(option){
        this.setData({
            questionTitle: option.title
        })
    },
    onReady: function() {
        this.getDetailList();
    }
})