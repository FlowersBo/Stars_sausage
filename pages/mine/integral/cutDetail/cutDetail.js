// pages/mine/integral/cutDetail/cutDetail.js
import Dialog from '../../../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  gotoCutInitegral() {
    wx.navigateTo({
      url: '../cutIntegral/cutIntegral',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  formSubmit(e) {
    console.log(e);
    let phone = e.detail.value.phone,
      count = e.detail.value.count;
    if (!phone) {
      wx.showToast({
        title: '请先输入手机号',
        icon: 'none',
        duration: 2000
      })
    } else if (!count) {
      wx.showToast({
        title: '请先输入转增积分',
        icon: 'none',
        duration: 2000
      })
    } else if (!(/^1[23456789]\d{9}$/.test(phone)) || phone.length < 11) {
      wx.showToast({
        title: '手机号输入有误',
        icon: 'none',
        duration: 2000
      })
    }else{
      Dialog.confirm({
        title: '转赠积分',
        message: `您确认转增当前积分吗？`,
        theme: 'round-button',
      }).then(() => {
        console.log('确认')
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