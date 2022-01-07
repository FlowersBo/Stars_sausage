// pages/orderList/orderList.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    top: [0, app.globalData.StatusBar + 44, app.globalData.StatusBar + 44+250, app.globalData.StatusBar + 44+400],
  },
  onScorll(event) {
    var theScreenHeight = wx.getSystemInfoSync().windowHeight;
    var scale = (theScreenHeight / event.detail.scrollHeight) * 0.3;
    // this.top[0] = -event.detail.scrollTop * (100/90) * scale;
    let top = this.data.top;
    top[1] = (-event.detail.scrollTop * (150 / 90) * scale)+app.globalData.StatusBar + 44;
    top[2] = (-event.detail.scrollTop * (200 / 90) * scale * 2.5) + app.globalData.StatusBar + 44+250;
    top[3] = (-event.detail.scrollTop * (250 / 90) * scale * 4) + app.globalData.StatusBar + 44+400;
    this.setData({
      top
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let navigationBarHeight = (app.globalData.StatusBar + 88) + 'px';
    console.log(navigationBarHeight);
    this.setData({
      navigationBarHeight
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