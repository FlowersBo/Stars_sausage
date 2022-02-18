// pages/facilityList/facilityList.js
import {kmUnit} from '../../utils/util';
const app = getApp()
let that;

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  async facilityListFn() {
    let {
      data
    } = await (app.http.Near({
      coordinate: `${wx.getStorageSync('loaction').latitude},${wx.getStorageSync('loaction').longitude}`
    }));
    console.log('设备列表', data);
    data.forEach(element => {
      element.distance = element.distance.toFixed();
      element.distance = kmUnit(Number(element.distance));
    });
    that.setData({
      equipmentList: data
    })
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.facilityListFn();
  },

  cityFn: e => {
    console.log('picker发送选择改变，携带值为', e.detail.region)
  },

  searchVal: e => {
    console.log('搜索内容', e.detail.val)
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