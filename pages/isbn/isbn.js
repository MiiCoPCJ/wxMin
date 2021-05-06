//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    data:0,

  },

  onLoad: function () {
  },



  //获取经纬度
  scan:function() {
      let that = this;
      wx.scanCode({
          onlyFromCamera: true,
          scanType: ['barCode'],
          success(res) {
              console.log(res)
          }
      })
  },


})
