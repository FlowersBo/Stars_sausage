// pages/facilityList/facilityList.js
import {
  kmUnit,
  unfreezeNavigateTo
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
        element.distance = element.distance.toFixed();
        element.distance = kmUnit(Number(element.distance));
      });
      that.setData({
        isFlag: false,
        equipmentList: data
      })
    } else {
      that.setData({
        isFlag: true,
        equipmentList:[]
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
    unfreezeNavigateTo({
      url: 'pages/reserveList/reserveList'
    });
    wx.navigateTo({
      url: '../reserveList/reserveList?deviceId=' + deviceid
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.facilityListFn();
  },

  cityFn: e => {
    console.log('城区', e);
    that.setData({
      point: e.detail.regionCode[2],
    })
    that.facilityListFn();
  },

  searchVal: e => {
    console.log('搜索内容', e.detail.val);
    that.setData({
      pointName: e.detail.val
    })
    that.facilityListFn();
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