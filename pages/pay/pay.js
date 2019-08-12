//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  },

  onLoad: function () {
  },



  //获取经纬度
  postPay() {
    var url = 'http://advance.back/index.php?r=default/pay';
    var appId = 'wxf1ccf2bf44c7b499';
    var secret = '91950ce77ffba8c0ac70f19f863a7292';
    var openid = 'oFMhW4zOSgGRklkHUay3TaJO3vKg';
    wx.request({
      url: url,
      data: {

      },
      header: {
        'content-type': 'application/json' //默认值
      },
      success: function (res) {
        console.log(res);
        wx.requestPayment({
          appId: res.data.data.appId,
          timeStamp: '' + res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType: res.data.data.signType,
          paySign: res.data.data.paySign,
          success: function (event) {
            console.log(event);
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            });
          },
          fail: function (error) {
            console.log("error")
            console.log(error)
          },
          complete: function (c) {
            "requestPayment:fail" != c.errMsg && "requestPayment:fail cancel" != c.errMsg ? wx.redirectTo({
              url: "/zh_ys/pages/order-dj/order-dj"
            }) : wx.showModal({
              title: "提示",
              content: "订单尚未支付",
              showCancel: !1,
              confirmText: "确认",
              success: function (e) {
                e.confirm && wx.redirectTo({
                  url: "/zh_ys/pages/order-dj/order-dj?status=1"
                });
              }
            });
          }
        });
      },
      fail:function(res){
        console.log(res);
      }
    })

  },


})
