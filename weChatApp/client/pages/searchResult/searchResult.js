var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        searchKey: '',
        logged: false,
    },
    onLoad: function(option){
        this.setData({
            searchKey: option.key
        })
    },
    onReady: function() {
    }
})