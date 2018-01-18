var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        logged: false,
        scorllTop: 0,
        questionTitle: '',
        contentDetail: '',
        like: '',
        comment: ''
    },
    getDetailList: function() {
        // var that = this;
        // util.http('titleDetailApi', {}, (res) => {
        //     if(res.errMsg) {
        //         util.showModel(res.errMsg);
        //     } else {
        console.log('请求回答详情');
        //         that.setData({
        //             title: res.data.title || '',
        //             describe: res.data.describe || '',
        //             answerNumber: res.data.answerNumber || '',
        //             answerList: res.data.answerList || []
        //         })
        //     }
        // })
    },
    // 加载更多
    onPullDownRefresh: function(){
        wx.stopPullDownRefresh();
    },
    onLoad: function(option){
        this.setData({
            questionTitle: option.title,
            contentDetail: option.content,
            like: option.like,
            comment: option.comment
        })
    },
    onReady: function() {
        this.getDetailList();
    }
})