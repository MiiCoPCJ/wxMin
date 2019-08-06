//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    lon:0,
    lat:0
  },

  onLoad: function () {
  },



  //获取经纬度
  getPosition() {
    let that = this;
    wx.getLocation({
        type: 'wgs84',
        success: function(res) {
          console.log(res);
          var latitude = res.latitude;
          var longitude = res.longitude;

          that.setData({
            lon: longitude,
            lat: latitude
          })


          var MapApi = 'http://apis.map.qq.com/ws/geocoder/v1/';//地图接口链接
          var qqMapApi = MapApi + "?location=" + latitude + ',' +
          longitude + "&key=" + 'XVLBZ-BSU66-ULJSQ-MFGXD-TM7GZ-55F2M' + "&get_poi=1";

          wx.request({
            url: qqMapApi,
            data: {},
            method: 'GET',
            success: (res) => {
              console.log(res)
              if (res.statusCode == 200 && res.data.status == 0) {
                  that.country = res.data.result.address_component.nation;
                  that.province = res.data.result.address_component.province;
                  that.city = res.data.result.address_component.city;
                  that.county = res.data.result.address_component.district;
                  that.street = res.data.result.address_component.street;
              }
            },
            fail:function(res){
              console.log(res);
            }
          })
        },
        fail:function(res){
          console.log(res);
        }
    })
  },


})
