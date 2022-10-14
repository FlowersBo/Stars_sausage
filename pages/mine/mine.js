// pages/mine/mine.js
// let parseURL = require('');
const app = getApp();
let that;
import {
  formatTime
} from '../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isVip: true
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
    animation.translate(6, -17).rotate(55).step()
    animation.translate(-6, -17).rotate(35).step()
    animation.translate(0, -17).rotate(45).step()
    that.setData({
      animationMiddleHeaderItem: animation.export()
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
  },

  infoFn() {
    app.http.Info({
        customerId: wx.getStorageSync('customerId')
      })
      .then(res => {
        console.log('用户信息', res);
        let cardExpire = res.data.customerInfo.cardExpire;
        let date = Date.parse(new Date());
        console.log(date);
        if (!cardExpire && date > cardExpire || res.data.customerInfo.cardId == 0) {
          that.setData({
            isVip: false
          })
        } else {
          that.setData({
            isVip: true
          })
        }
        that.setData({
          customer: res.data,
          cardExpire: `${cardExpire?formatTime(new Date(cardExpire)):''}`
        })
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let circleCount = 0;
    // 心跳的外框动画 
    this.animationMiddleHeaderItem = wx.createAnimation({
      duration: 1200, // 以毫秒为单位 
      timingFunction: 'ease-in-out',
      delay: 0,
      transformOrigin: '50% 50%',
      success: function (res) {}
    });
    setInterval(function () {
      if (circleCount % 2 == 0) {
        this.animationMiddleHeaderItem.translateY(-34).rotate(45).step();
      } else {
        this.animationMiddleHeaderItem.translateY(0).rotate(45).step();
      }
      this.setData({
        animationMiddleHeaderItem: this.animationMiddleHeaderItem.export()
      });
      circleCount++;
      if (circleCount == 1200) {
        circleCount = 0;
      }
    }.bind(this), 1200);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().setData({
      selected: 1
    })
    that.infoFn();
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