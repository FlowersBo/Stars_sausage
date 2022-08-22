// pages/coupon/coupon.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
let that;
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let scene = options.scene;
    console.log(options.scene);
    // scene = "1560464164395155456%2C1";
    scene = decodeURIComponent(scene);
    let sceneId = scene.split(',')[0];
    let sceneType = scene.split(',')[1];
    console.log('截取参数',sceneId,sceneType);
    that.setData({
      sceneId,
      sceneType
    })
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        // 获取可使用窗口宽度
        let clientHeight = res.windowHeight;
        // 获取可使用窗口高度
        let clientWidth = res.windowWidth;
        // 算出比例
        let ratio = 750 / clientWidth;
        // 算出高度(单位rpx)
        let height = clientHeight * ratio;
        // 设置高度
        console.log(clientHeight, app.globalData.StatusBar)
        that.setData({
          clientHeight,
          navigationBarHeight: app.globalData.StatusBar + 44,
        });
      }
    });
    that.authFn();
    that.couponFn();
  },
  authFn(mpOpenId = '') {
    wx.login({
      success: res => {
        app.http.Auth({
            code: res.code,
            mpOpenId
          })
          .then(res => {
            wx.setStorageSync('customerId', res.data.id);
            wx.setStorageSync('phoneNumber', res.data.phone);
          })
      }
    })
  },

  couponFn() {
    if (that.data.sceneType == 0) {
      app.http.CouponBag({
          bagId: that.data.sceneId
        })
        .then(res => {
          console.log('包', res)
          that.setData({
            coupon: res.data
          })
        })
        .catch(err => {

        })
    } else {
      app.http.CouponBc({
          bcId: that.data.sceneId
        })
        .then(res => {
          console.log('单', res)
          that.setData({
            coupon: res.data
          })
        })
        .catch(err => {

        })
    }
  },

  robcouponFn() {
    if (that.data.sceneType == 0) {
      app.http.DrawBag({
          bagId: that.data.sceneId,
          customerId: wx.getStorageSync('customerId')
        })
        .then(res => {
          console.log('领取包', res)
          Dialog.confirm({
            title: '提示',
            message: `恭喜您抢到了${res.data.couponName}`,
            theme: 'round-button',
            showCancelButton: false,
            confirmButtonText: '去下单'
          }).then(() => {
            wx.switchTab({
              url: '/pages/home/home'
            })
          }).catch(() => {});
        })
        .catch(err => {
          wx.hideToast();
          Dialog.confirm({
            title: '提示',
            message: `您已领取过优惠券，可直接下单`,
            theme: 'round-button',
            showCancelButton: false,
            confirmButtonText: '去下单'
          }).then(() => {
            wx.switchTab({
              url: '/pages/home/home'
            })
          }).catch(() => {});
        })
    } else {
      app.http.DrawCoupon({
          bcId: that.data.sceneId,
          customerId: wx.getStorageSync('customerId')
        })
        .then(res => {
          console.log('领取单', res)
          Dialog.confirm({
            title: '提示',
            message: `恭喜您抢到了${res.data.couponName}`,
            theme: 'round-button',
            showCancelButton: false,
            confirmButtonText: '去下单'
          }).then(() => {
            wx.switchTab({
              url: '/pages/home/home'
            })
          }).catch(() => {});
        })
        .catch(err => {
          wx.hideToast();
          Dialog.confirm({
            title: '提示',
            message: `您已领取过优惠券，可直接下单`,
            theme: 'round-button',
            showCancelButton: false,
            confirmButtonText: '去下单'
          }).then(() => {
            wx.switchTab({
              url: '/pages/home/home'
            })
          }).catch(() => {});
        })
    }
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