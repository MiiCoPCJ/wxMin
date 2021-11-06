//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    formId:'',
  },

  onLoad: function () {

  },
  getFormID: function (e) {
      console.log(e.detail.formId);
       this.setData({
         formId: e.detail.formId,
      });

      wx.request({
          url: 'https://binfen.hkzshs.com/web/index.php?r=api/test/wx-push',
          method: "GET",
          data: {
              formId:e.detail.formId,
              openId:wx.getStorageSync('openid'),
          },
          success: function(e) {
              console.log(e);
          },
          failed:function(e){
              console.log(e);
          }
      });

  },

  newPush:function(){
    wx.requestSubscribeMessage({
      tmplIds: ['fTT3u__YmtBNfn3TLQ2GVEIsOJk0_lLNBzkHjbLftBc'],
      success (res) {
          console.log(res);
       }
    })
  },

  //登录获取openid并存缓存
  login:function(){
    wx.login({
      success:function(res){
        console.log(res.code)
        //发送请求
        wx.request({
          url: 'https://binfen.hkzshs.com/web/index.php?r=/api/test/get-openid', //接口地址
          data: {code:res.code},
          header: {
            'content-type': 'application/json' //默认值
          },
          success: function (res) {
            console.log(res.data);
            console.log(res.data.data.openid)
            wx.setStorageSync('session_key', res.data.data.session_key);
            wx.setStorageSync('openid', res.data.data.openid);
          }
        })
      }
    })
  },

  //从缓存获取openid
  getOpenId:function(){
    console.log(wx.getStorageSync('session_key'));
    console.log(wx.getStorageSync('openid'));
  },

  //跳转小程序
  otherWX:function(){
    wx.navigateToMiniProgram({
      appId: 'wx0aa72319b1c96bcf',
      path: 'page/index/index',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'develop',
      success(res) {
        // 打开成功
      }
    })
  },

  //保存formId
  saveformIdOutline:function(e){
    console.log(e.detail.formId);
    wx.request({
      url: 'http://whjz.local/index.php?s=/api/weixin/saveformId', //接口地址
      data: {
          formId:e.detail.formId,
      },
      success: function(e) {
          console.log(e);
      },
      failed:function(e){
          console.log(e);
      }
    })
  },


  saveformIdOnline:function(e){
    console.log(e.detail.formId);
    wx.setStorageSync('formId',e.detail.formId)
  },

})
