// pages/facilityListMap/addressSearch/addressSearch.js
let QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
let qqmapsdk = new QQMapWX({
  key: '6UXBZ-3HTWX-MMW4G-TX4UC-RP2U6-K7B4V'
});
import {
  kmUnit
} from '../../../utils/util';
let that;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFlag: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      cityCode: options.cityCode,
      city: options.city
    })
    that.cityFn();
  },

  backfill: function (e) {
    var id = e.currentTarget.id;
    this.data.suggestion.map((el, index) => {
      if (index == id) {
        console.log(el);
        let startPoint = JSON.stringify({
          'name': el.title,
          'latitude': el.latitude,
          'longitude': el.longitude
        })
        that.setData({
          backfill: el.title,
          startPoint,
          suggestion: []
        });
        that.facilityListFn();
      }
    })
  },

  bindInputFn(e){
    if(!e.detail.value){
      that.setData({
        suggestion: []
      })
    }
  },

  getsuggest: function (e) {
    if (!e.detail.value) {
      that.setData({
        suggestion: [],
      })
      return
    }
    that.setData({
      equipmentList: [],
      startPoint: JSON.stringify({
        'name': '当前位置',
        'latitude': wx.getStorageSync('loaction').latitude,
        'longitude': wx.getStorageSync('loaction').longitude
      })
    })
    app.http.Search({
        coordinate: `${wx.getStorageSync('loaction').latitude},${wx.getStorageSync('loaction').longitude}`,
        searchTag: e.detail.value,
        regionId: `${that.data.cityValue?that.data.cityValue.value:wx.getStorageSync('adcode')}`
      })
      .then(res => {
        console.log('搜索返回', res)
        if (res.data.length > 0) {
          res.data.forEach(element => {
            element.longitude = Number(element.coordinate.split(',')[1]);
            element.latitude = Number(element.coordinate.split(',')[0]);
            element.distance = kmUnit(Number(element.distance));
          });
          that.setData({
            equipmentList: res.data,
            isFlag: false
          })
          that.deviceStatusFn(res.data);
        } else {
          qqmapsdk.getSuggestion({
            keyword: e.detail.value, //可设置固定值,如keyword:'KFC'
            region: `${that.data.cityValue?that.data.cityValue.label:that.data.city}`,
            region_fix: 1,
            success: function (res) {
              var sug = [];
              for (var i = 0; i < res.data.length; i++) {
                sug.push({
                  title: res.data[i].title,
                  id: res.data[i].id,
                  addr: res.data[i].address,
                  city: res.data[i].city,
                  district: res.data[i].district,
                  latitude: res.data[i].location.lat,
                  longitude: res.data[i].location.lng
                });
              }
              that.setData({
                suggestion: sug
              });
            },
            fail: function (error) {
              console.error(error);
            },
            complete: function (res) {}
          });
        }
      })
  },

  equipmentFn(e, elementDataId) {
    console.log(e);
    let equipmentList = that.data.equipmentList;
    equipmentList.forEach(element => {
      if ((elementDataId ? elementDataId : e.currentTarget.dataset.id) === element.id) {
        element.isShow = true;
        that.setData({
          deviceId: element.deviceId
        })
      } else {
        element.isShow = false;
      }
    });
    that.setData({
      equipmentList
    })
  },

  // 状态
  deviceStatusFn(equipmentList) {
    let equipmentStatusList = [];
    equipmentList.forEach(element => {
      app.http.Status({
          deviceId: element.deviceId
        })
        .then(res => {
          let data = {};
          data.id = element.id;
          data.status = res.data;
          equipmentStatusList = equipmentStatusList.concat(data);
          that.setData({
            equipmentStatusList,
          })
        })
        .catch(err => {

        })
    })
  },

  async facilityListFn() {
    try {
      let {
        data
      } = await (app.http.Near({
        coordinate: `${JSON.parse(that.data.startPoint).latitude},${JSON.parse(that.data.startPoint).longitude}`,
        isAgency: false,
        region: `${that.data.cityValue?that.data.cityValue.value:wx.getStorageSync('adcode')}`,
      }))
      if (data.length > 0) {
        data.map(element => {
          element.longitude = Number(element.coordinate.split(',')[1]);
          element.latitude = Number(element.coordinate.split(',')[0]);
          element.distance = kmUnit(Number(element.distance));
        })
        that.deviceStatusFn(data);
        that.setData({
          isFlag: false,
          equipmentList: data,
        })
      } else {
        that.setData({
          isFlag: true,
          equipmentList: []
        })
      }
    } catch (err) {
      that.setData({
        isFlag: true,
        equipmentList: []
      })
    }
  },

  //导航
  showModal(e) {
    console.log('当前id', e)
    that.data.equipmentList.forEach(element => {
      if (e.currentTarget.dataset.id === element.id) {
        let plugin = requirePlugin('routePlan');
        let key = '6UXBZ-3HTWX-MMW4G-TX4UC-RP2U6-K7B4V';
        let referer = '星斗锦绣肠';
        let mode = 'walking';
        let themeColor = '#FFB606';
        let endPoint = JSON.stringify({
          'name': element.name,
          'latitude': element.latitude,
          'longitude': element.longitude
        });
        console.log(that.data.startPoint)
        wx.navigateTo({
          url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&startPoint=' + that.data.startPoint + '&endPoint=' + endPoint + '&mode=' + mode + '&themeColor=' + themeColor
        });
      }
    });
  },


  async cityFn() {
    let result = await (app.http.GetCity());
    console.log('城市列表', result)
    let cityList = [],
      cityListData = [];
    for (let key in result.data) {
      cityListData.push({
        label: result.data[key],
        value: key
      })
      cityList.push(result.data[key])
    }
    that.setData({
      cityList,
      cityListData
    })
  },

  // 城市选择
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      cityValue: that.data.cityListData[e.detail.value],
      backfill: '',
      equipmentList: [],
      suggestion: []
    })
  },

  gotoReserveListFn(e) {
    if (!this.data.deviceId) {
      wx.showToast({
        title: that.data.isFlag ? '附近暂无点位' : '请选择点位后下单',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.navigateTo({
      url: '/pages/reserveList/reserveList?deviceId=' + this.data.deviceId
    });
    console.log(this.data.deviceId)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})