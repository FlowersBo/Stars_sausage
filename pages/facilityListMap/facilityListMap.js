// pages/facilityListMap/facilityListMap.js
import {
  kmUnit
} from '../../utils/util';
const app = getApp()
let that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    point: '',
    pointName: '',
    isFlag: false,
    scale: 10.5,
  },

  async facilityListFn() {
    let {
      data
    } = await (app.http.Near({
      coordinate: `${wx.getStorageSync('loaction').latitude},${wx.getStorageSync('loaction').longitude}`,
      point: that.data.point,
      pointName: that.data.pointName
    }));
    console.log('设备列表', data);
    if (data) {
      data.forEach(element => {
        // element.distance = element.distance.toFixed();
        element.distance = kmUnit(Number(element.distance));
        element.longitude = Number(element.coordinate.split(',')[1]);
        element.latitude = Number(element.coordinate.split(',')[0]);
        element.id = Number(element.id);
        element.width = 20;
        element.height = 20;
        element.iconPath = '/assets/img/map.png';
        // element.joinCluster = true;
        element.callout = {
          content: element.name,
          display: 'ALWAYS',
          padding: '2px',
          borderRadius: '20px',
          color: '#fff',
          bgColor: '#FFB606'
        }
      });
      that.setData({
        isFlag: false,
        equipmentList: data
      })
      that.bindEvent();
    } else {
      that.setData({
        isFlag: true,
        equipmentList: []
      })
    }
    wx.hideLoading()
    wx.hideNavigationBarLoading() //在标题栏中隐藏加载
    wx.stopPullDownRefresh()
  },

  gotoReserveListFn(e) {
    console.log(e)
    let {
      deviceid
    } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../reserveList/reserveList?deviceId=' + deviceid
    })
  },

  showModal(e) {
    console.log('当前id', e)
    that.data.equipmentList.forEach(element => {
      if (e.markerId === element.id) {
        let plugin = requirePlugin('routePlan');
        let key = '6UXBZ-3HTWX-MMW4G-TX4UC-RP2U6-K7B4V'; //使用在腾讯位置服务申请的key
        let referer = '星斗锦绣肠'; //调用插件的app的名称
        let endPoint = JSON.stringify({ //终点
          'name': element.name,
          'latitude': element.latitude,
          'longitude': element.longitude
        });
        wx.navigateTo({
          url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
        });




        // this.mapCtx.openMapApp({
        //   longitude: element.longitude,
        //   latitude: element.latitude,
        //   destination: element.name
        // })
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.facilityListFn();
    that.setData({
      longitude: wx.getStorageSync('loaction').longitude,
      latitude: wx.getStorageSync('loaction').latitude,
      viewHeight: app.globalData.screenHeight
    })
    this.mapCtx = wx.createMapContext('map');
  },

  bindEvent() {
    // this.mapCtx.initMarkerCluster({
    //   enableDefaultStyle: true,
    //   zoomOnClick: true,
    //   gridSize: 60,
    //   complete(res) {
    //     console.log('initMarkerCluster', res)
    //   }
    // })
    console.log(that.data.equipmentList);
    this.mapCtx.addMarkers({
      markers: that.data.equipmentList,
      clear: true,
      complete(res) {
        console.log('addMarkers', res)
      }
    })
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
    that.setData({
      pointName: '',
      point: '',
      region: ''
    })
    that.facilityListFn();
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