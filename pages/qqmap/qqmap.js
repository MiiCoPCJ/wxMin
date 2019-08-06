var QQMapWX = require('../../qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

    onLoad: function () {
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
            key: 'QT4BZ-RW6RK-ORWJ3-AVLKN-X56R6-YHBFT'
        });
    },
    onShow: function () {
        // 调用接口
        qqmapsdk.search({
            keyword: '梅州',
            success: function (res) {
                console.log(res);
            },
            fail: function (res) {
                console.log(res);
            },
            complete: function (res) {
                console.log(res);
            }
        });

        wx.getLocation({
          type: 'gcj02',
          success: function (res) {
            qqmapsdk.reverseGeocoder({
              location: {
                latitude: res.latitude,
                longitude: res.longitude
              },
              success: function (addressRes) { //成功后的回调
                var addressRes = addressRes.result;
                console.log( addressRes.address)
                 },
              fail: function (error) {
                console.error(error);
              },
              complete: function (addressRes) {
                console.log(addressRes);
              }
            })
          }
        })
    },





})
