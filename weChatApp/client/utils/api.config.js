var base = 'https://www.easy-mock.com/mock/5a39d3d2717d4953ed48bd47/weChatApp/'
var api = {
    focusListApi: {
        development: base + 'zhixiaohu/home/focusList',
    },
    recommendListApi: {
        development: base + 'zhixiaohu/home/recommendList',
    },
    hotListApi: {
        development: base + 'zhixiaohu/home/hotList',
    },
    searchApi: {
        development: base + 'zhixiaohu/home/searchResult',
    },
    userListApi: {
        development: base + 'zhixiaohu/userList'
    },
    discussListApi: {
        development: base + 'zhixiaohu/findMore/discusstList'
    },
    recFocusListApi: {
        development: base + 'zhixiaohu/findMore/recFocusList'
    },
    recHotListApi: {
        development: base + 'zhixiaohu/findMore/recHotList'
    },
    marketListApi: {
        development: base + 'zhixiaohu/market/marketList'
    },
    messageListApi: {
        development: base + 'zhixiaohu/message/messageList'
    },
    titleDetailApi: {
        development: base + 'zhixiaohu/detail/titleDetail'
    },
}

module.exports = api;