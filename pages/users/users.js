//index.js
//获取应用实例

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    show: false,   //改变值用于刷新页面
  },

  onLoad: function () {

  },
  getUserData: function (e) {
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

  getCode: function () {
    wx.login({
      success: function (res) {
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
            /*
            /*  刷新本页面  
            //1.直接获取到当前页面的onload()进行刷新
            var that = this
            that.onload()
            

            //2.pages 获取到当前页码数   然后执行当前页的onLoad
            const pages = getCurrentPages()
            const perpage = pages[pages.length - 1]
            perpage.onLoad() 
            ^^^^^可用

            //3.改变值用于刷新页面
            this.setData({
              show: true
            })
            ^^^^^可用

            /* 刷新上一页面 
            //点击左上角的返回按钮时，返回事件不会触发 onload() ,但是会触发 onshow()
            //所以可以在onshow()中写入刷新或者是调取页面数据的代码。返回的时候会进行刷新
            data: {
              show: false
            }
            //每次进入页面都会将show变为true
            onshow: {
              this.setData({
                show: true
              })
            }

            //获取页码数进行刷新，跟当前页面的刷新的方式是一样的
            var pages = getCurrentPages()
            //对上一页进行刷新
            pages[pages.length - 2].onload() 
            */


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


  getPhoneNumberAlpha: function (e) {
    console.log(e);
    var ivObj = e.detail.iv;
    var telObj = e.detail.encryptedData;
    var appid = 'wx0a6d901750d60609';
    var secret = '4272aed411d948b01c829e5442d534ce';
    wx.login({
      success: function (res) {
        console.log(res);

        //访问登录凭证校验接口获取session_key、openid
        wx.request({
          url: "https://api.weixin.qq.com/sns/jscode2session",
          data: {
            'appid': appid,
            'secret': secret,
            'js_code': res.code,
            'grant_type': "authorization_code"
          },
          method: 'GET',
          header: {
            'content-type': 'application/json'
          },
          success: function (data) {
            console.log("data", data)
            if (data.statusCode == 200) {

              wx.request({
                url: 'http://whjz.local/index.php?s=/api/weixin/decryptedPhone',
                data: {
                  appid: appid,
                  secret: secret,
                  session_key: encodeURIComponent(data.data.session_key),
                  //encryptedData: telObj,
                  //iv: ivObj
                  encryptedData: encodeURIComponent(telObj),
                  iv: encodeURIComponent(ivObj),
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
          }
        });
      }
    });

  },


  getPhoneNumber: function (e) {
    console.log(e);
    var ivObj = e.detail.iv
    var telObj = e.detail.encryptedData
    wx.login({
      success: function (res) {
        console.log(res);
        var appid = 'wx0a6d901750d60609';
        var secret = '4272aed411d948b01c829e5442d534ce';

        wx.request({
          url: 'http://whjz.local/index.php?s=/api/weixin/decryptedPhone',
          data: {
            appid: appid,
            secret: secret,
            code: encodeURIComponent(res.code),
            //encryptedData: telObj,
            //iv: ivObj
            encryptedData: encodeURIComponent(telObj),
            iv: encodeURIComponent(ivObj),
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
    });

  },

  getOpenId: function (e) {
    var url = 'https://api.weixin.qq.com/sns/jscode2session';
    //var appid = 'wx6d424ce04b9fdce8';
    //var secret = 'ad2b3453f8b91c6fe8143e689151ee22';
    var appid = 'wxf1ccf2bf44c7b499';
    var secret = '91950ce77ffba8c0ac70f19f863a7292';
    wx.request({
      url: url,
      data: {
        js_code: wx.getStorageSync('wx_code'),
        appid: appid,
        secret: secret,
        grant_type: 'authorization_code',
      },
      header: {
        'content-type': 'application/json' //默认值
      },
      success: function (res) {
        console.log(res);
        wx.setStorageSync('session_key', res.session_key);
        wx.setStorageSync('openid', res.opentid);
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },



})
