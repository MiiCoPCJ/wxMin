//index.js
//获取应用实例

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function () {

  },
  getUserData: function(e) {
    let that = this;
    wx.getUserInfo({
      success: res => {
        console.log(res);
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },

  getCode:function(){
    wx.login({
      success:function(res){
        console.log(res.code);
        wx.setStorageSync('wx_code', res.code);

      }
    })
  },


  getPhoneNumberBate: function (e) {
    let that = this;
    var appid = 'wx0a6d901750d60609';
    var secret = '4272aed411d948b01c829e5442d534ce';
    wx.login({
      success: function (res) {
        wx.setStorageSync('wx_code', res.code);
      }
    });
    wx.getUserInfo({
      success: res => {
        console.log(res);

        wx.request({
          url: 'http://whjz.local/index.php?s=/api/weixin/decryptedPhone',
          data: {
            appid: appid,
            secret: secret,
            code: wx.getStorageSync('wx_code'),
            encryptedData: res.encryptedData,
            iv: res.iv
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res);
            // phoneObj = res.data.phoneNumber;
            // console.log("手机号=", phoneObj)
            // wx.setStorage({
            //   key: "phoneObj",
            //   data: res.data.phoneNumber,
            // })
          }
        });


      }
    })
  },

  getPhoneNumber:function(e){
    var ivObj = e.detail.iv
    var telObj = e.detail.encryptedData
    wx.login({
      success: function (res) {
        wx.setStorageSync('wx_code', res.code);
      }
    });
    var appid = 'wx0a6d901750d60609';
    var secret = '4272aed411d948b01c829e5442d534ce';
    wx.request({
      url: 'http://whjz.local/index.php?s=/api/weixin/decryptedPhone',
      data: {
        appid: appid,
        secret: secret,
        code: wx.getStorageSync('wx_code'),
        encryptedData: telObj,
        iv: ivObj
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        // phoneObj = res.data.phoneNumber;
        // console.log("手机号=", phoneObj)
        // wx.setStorage({
        //   key: "phoneObj",
        //   data: res.data.phoneNumber,
        // })
      }
    });
  },

  getOpenId:function(e){
    var url = 'https://api.weixin.qq.com/sns/jscode2session';
    var appid = 'wx0a6d901750d60609';
    var secret = '4272aed411d948b01c829e5442d534ce';
    wx.request({
      url: url,
      data: {
        js_code:wx.getStorageSync('wx_code'),
        appid:appid,
        secret:secret,
        grant_type:'authorization_code',
      },
      header: {
        'content-type': 'application/json' //默认值
      },
      success: function (res) {
        console.log(res);
        wx.setStorageSync('session_key', '');
        wx.setStorageSync('openid', '');
      },
      fail:function(res){
        console.log(res);
      }
    })
  },



})
