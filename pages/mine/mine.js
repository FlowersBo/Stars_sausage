// pages/mine/mine.js
// let parseURL = require('');
const app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isVip: false
  },

  opendMaskFn() {
    that.setData({
      isFlag: true
    })
  },

  deleteMaskFn() {
    that.setData({
      isFlag: false
    })
  },

  // 充值
  refillFn() {
    wx.navigateTo({
      url: './recharge/recharge',
    })
  },

  // 充值会员
  rechargeVipFn() {
    wx.navigateTo({
      url: './rechargeVip/rechargeVip',
    })
  },

  clickBubble() {
    let animation = wx.createAnimation({
      duration: 90,
      timingFunction: 'linear',
    });
    animation.translate(80, -50).step();
    // that.setData({
    //   animation
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.infoFn();
  },
  infoFn() {
    app.http.Info({
        customerId: wx.getStorageSync('customerId')
      })
      .then(res => {
        console.log('用户信息', res);
        that.setData({
          customer: res.data
        })
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
    this.getTabBar().setData({
      selected: 1
    })
  },
  makePhoneFn() {
    wx.makePhoneCall({
      phoneNumber: '4008800975',
      fail(err) {

      }
    })
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