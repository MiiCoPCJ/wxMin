//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/region.js');

Page({
  data: {
    district: null
  },

  onLoad: function () {
    var t = this;
    //获取
    // wx.request({
    //   url: 'http://whjz.local/index.php?s=/api/service/ajax_regionlist',
    //   data: {},
    //   method: 'GET',
    //   success: (res) => {
    //     console.log(res);
    //     var datas = res.data.data;
    //     util.sels(datas);
    //   },
    //   fail: function (res) {
    //     console.log(res);
    //   }
    // })
    var a = [1, 2];
    wx.request({
      url: 'http://whjz.local/index.php?s=/api/service/DelCart',
      data: {
        id: a
      },
      method: 'GET',
      success: (res) => {
        console.log(res);
        // wx.setStorageSync('DISTRICT', res.data);
      },
      fail: function (res) {
        console.log(res);
      }
    })

    // t.getDistrictData(function (e) {
    //   area_picker.init({
    //     page: t,
    //     data: e
    //   });
    // }), t.setData({
    //   address_id: e.id
    // })
  },

  getDistrictData: function (t) {

  },
  onAreaPickerConfirm: function (e) {
    this.setData({
      district: {
        province: {
          id: e[0].id,
          name: e[0].name
        },
        city: {
          id: e[1].id,
          name: e[1].name
        },
        district: {
          id: e[2].id,
          name: e[2].name
        }
      }
    });
  },



})
