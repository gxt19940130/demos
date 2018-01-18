//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        logged: false,
        takeSession: false,
        requestResult: '',
        isShow: false,
        isShowQues: false,
        isActive: 1,
        animationData: {},
        footerTip: {
            topic: '去文章列表',
            question: '关注话题',
            column: '去往专栏',
            live: '全部live'
        },
        focusList: [],
        recList: [],
        hotList: [],
        loadMore: '加载更多',
        isLoading: false,
        historyList: [],
        searchVal: ''
    },

    // 获取用户权限
    getSetting: function() {
        console.log('获取用户权限')
        var that = this;
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.userInfo']) {
                    wx.authorize({
                        scope: 'scope.userInfo',
                        success(res) {
                            that.login()
                        },
                        error() {}
                    })
                } else {
                    that.data.logged ? that.getUserInfo() : that.login();
                }
            }
        })
    },
    // 用户登录
    login: function() {
        console.log('用户登录');
        if (this.data.logged) return
        var that = this
        // 调用登录接口
        qcloud.login({
            success(result) {
                if (result) {
                    that.setData({
                        userInfo: result,
                        logged: true
                    });
                    console.log('首次登录，存储用户信息')
                    wx.setStorage({
                        key: 'userInfo',
                        data: that.data.userInfo
                    });
                } else {
                    // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
                    qcloud.request({
                        url: config.service.requestUrl,
                        login: true,
                        success(result) {
                            // util.showSuccess('登录成功')
                            that.setData({
                                userInfo: result.data.data,
                                logged: true,
                            });
                            console.log('非首次登录，存储用户信息')
                            wx.setStorage({
                                key: 'userInfo',
                                data: that.data.userInfo
                            });
                        },
                        fail(error) {
                            util.showModel('请求失败', error)
                            console.log('request fail', error)
                        }
                    })
                }
            },

            fail(error) {
                util.showModel('登录失败', error)
                console.log('登录失败', error)
            }
        })
    },
    // 获取用户信息
    getUserInfo: function() {
        var that = this;
        console.log('获取用户信息')
        wx.getUserInfo({
            success: function(res) {
                var userInfo = res.userInfo
                var nickName = userInfo.nickName
                var avatarUrl = userInfo.avatarUrl
                var gender = userInfo.gender //性别 0：未知、1：男、2：女
                var province = userInfo.province
                var city = userInfo.city
                var country = userInfo.country
                that.setData({
                    userInfo: userInfo,
                    logged: true
                })
                console.log('请求用户信息，存储用户信息')
                wx.setStorage({
                    key: 'userInfo',
                    data: that.data.userInfo
                });
                // 存储最后一次点击tab的index
                wx.setStorage({
                    key: 'lastIndex',
                    data: that.data.isActive
                });
            },
            fail: function(res) {
                that.getSetting();
            }
        })
    },
    // 显示搜索蒙层
    showMask: function() {
        var that = this;
        this.setData({
            isShow: true,
            searchVal: ''
        })
        wx.getStorage({
            key: 'searchHistory',
            success: function(res) {
                that.setData({
                    historyList: res.data
                })
            }
        });
    },
    showQuesMask: function() {
        this.setData({
            isShowQues: true
        })
    },
    // 隐藏搜索蒙层
    hideMask: function() {
        this.setData({
            isShow: false
        })
    },
    hideQuesMask: function() {
        this.setData({
            isShowQues: false
        })
    },
    // 设置显示的tab
    setActive: function(e) {

        // 获取当前点击的index
        var index = e.target.dataset.index;
        // 初始化动画数据
        var animation = wx.createAnimation({
            duration: 500,
            timingFunction: 'ease-out',
            delay: 0
        })
        // 距离左边位置
        animation.left((index * 250) + 'rpx').step()
        // 设置动画
        this.setData({
            animationData: animation.export()
        })
        // 设置对应class
        this.setData({
            isActive: index
        })
    },
    // 获取关注列表
    getFocusList(flag) {
        var that = this;
        util.http('focusListApi', {}, (res) => {
            if(res.errMsg) {
                util.showModel(res.errMsg);
            } else {
                that.setData({
                    focusList: res.list
                })
                console.log('请求关注列表数据');
                if(flag) {
                    console.log('刷新关注列表数据');
                    that.setData({
                        focusList: res.list.concat(that.data.focusList)
                    })
                    wx.stopPullDownRefresh();
                    wx.hideNavigationBarLoading();
                    util.showSuccess(res.list.length + '条新内容');
                }
            }
        })
    },
    // 获取推荐列表
    getRecommendList(flag) {
        var that = this;
        util.http('recommendListApi', {}, (res) => {
            if(res.errMsg) {
                util.showModel(res.errMsg);
            } else {
                if(!flag) {
                    console.log('setData')
                    that.setData({
                        recList: res.list
                    })
                }
                console.log('请求推荐列表数据');
                if(flag) {
                    that.setData({
                        recList: res.list.concat(that.data.recList)
                    })
                    console.log('刷新推荐列表数据');
                    wx.stopPullDownRefresh();
                    wx.hideNavigationBarLoading();
                    util.showSuccess(res.list.length + '条新内容');
                }
            }
        })
    },
    // 获取热门列表
    getHotList(flag) {
        var that = this;
        util.http('hotListApi', {}, (res) => {
            if(res.errMsg) {
                util.showModel(res.errMsg);
            } else {
                if(!flag) {
                    console.log('setData')
                    that.setData({
                        hotList: res.list
                    })
                }
                console.log('请求热门列表数据');
                if(flag) {
                    that.setData({
                        hotList: res.list.concat(that.data.hotList)
                    })
                    console.log('刷新热门列表数据');
                    wx.stopPullDownRefresh();
                    wx.hideNavigationBarLoading();
                    util.showSuccess(res.list.length + '条新内容');
                }
            }
        })
    },
    // 加载更多关注列表
    getMoreFocusList() {
        var that = this;
        this.setData({
            isLoading: true,
            loadMore: '正在加载...'
        })
        util.http('focusListApi', {}, (res) => {
            !res.errMsg ? that.setData({ focusList: that.data.focusList.concat(res.list) })
                        : util.showModel(res.errMsg);
            console.log('请求更多关注列表数据');
            this.setData({
                isLoading: false,
                loadMore: '加载更多'
            })
        })
    },
    // 加载更多推荐列表
    getMoreRecList() {
        var that = this;
        this.setData({
            isLoading: true,
            loadMore: '正在加载...'
        })
        util.http('recommendListApi', {}, (res) => {
            !res.errMsg ? that.setData({ recList: that.data.recList.concat(res.list) })
                        : util.showModel(res.errMsg);
            console.log('请求更多推荐列表数据');
            this.setData({
                isLoading: false,
                loadMore: '加载更多'
            })
        })
    },
    // 加载热门推荐列表
    getMoreHotList() {
        var that = this;
        this.setData({
            isLoading: true,
            loadMore: '正在加载...'
        })
        util.http('hotListApi', {}, (res) => {
            !res.errMsg ? that.setData({ hotList: that.data.hotList.concat(res.list) })
                        : util.showModel(res.errMsg);
            console.log('请求更多热门列表数据');
            this.setData({
                isLoading: false,
                loadMore: '加载更多'
            })
        })
    },
    // 搜索话题
    searchTopic(e) {
        var history = [],
            that = this;
        wx.getStorage({
            key: 'searchHistory',
            success: function(res) {
                that.setData({
                    historyList: res.data
                })
            }
        });
        console.log('存储搜索历史');
        e.detail.value && that.data.historyList.indexOf(e.detail.value) === -1 && that.setData({
            historyList: that.data.historyList.concat(e.detail.value)
        })
        wx.setStorage({
            key: 'searchHistory',
            data: this.data.historyList
        });
        wx.navigateTo({
            url: '../../pages/searchResult/searchResult?key=' + e.detail.value,
            complete: function(res) {
                console.log(res, '跳转到搜索结果页')
                that.setData({
                    isShow: false
                })
            }
        });
    },
    clearAll() {
        wx.removeStorage({
            key: 'searchHistory',
            success: function(res) {
                console.log(res, '清除成功')
            }
        })
        this.setData({
            historyList: []
        })
    },
    clearItem(e) {
        // 获取当前点击的index
        var index = e.target.dataset.index;
        this.data.historyList.splice(index, 1);
        // console.log(history, this.data.historyList)
        this.setData({
            historyList:  this.data.historyList
        })
        wx.setStorage({
            key: 'searchHistory',
            data: this.data.historyList
        });
    },
    goTitleDetail(e) {
        wx.navigateTo({
            url: '../../pages/titleDetail/titleDetail?id=' + e.target.dataset.id + '&title=' + e.target.dataset.title
        })
    },
    goContentDetail(e) {
        wx.navigateTo({
            url: '../../pages/contentDetail/contentDetail?id=' + e.target.dataset.id + '&title=' + e.target.dataset.title + '&avatar=' + e.target.dataset.avatar + '&content=' + e.target.dataset.content + '&like=' + e.target.dataset.like + '&comment=' + e.target.dataset.comment
        })
    },
    // 刷新数据
    onPullDownRefresh: function(){
        if(!this.data.isShow && !this.data.isShowQues) {
            wx.showNavigationBarLoading();
            switch(+this.data.isActive) {
                case 0: this.getFocusList(true); break;
                case 1: this.getRecommendList(true); break;
                case 2: this.getHotList(true); break;
                default: break;
            }
        }
    },
    // 加载更多
    onReachBottom: function() {
        if(!this.data.isShow && !this.data.isShowQues) {
            switch(+this.data.isActive) {
                case 0: this.getMoreFocusList(); break;
                case 1: this.getMoreRecList(); break;
                case 2: this.getMoreHotList(); break;
                default: break;
            }
        }
    },
    onReady: function() {
        this.getUserInfo();
        this.getFocusList();
        this.getRecommendList();
        this.getHotList();
    }
})