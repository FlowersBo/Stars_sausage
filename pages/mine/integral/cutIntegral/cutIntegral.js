// pages/mine/integral/cutIntegral/cutIntegral.js
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {
      scrollbar: false,
      currentTab: 0,
      nav: ['转增记录', '接收记录'],
      navIndex:1
    }
  },

  cutIntegralFn() {
    wx.navigateTo({
      url: '',
    })
  },

  tabNav(e) {
    let currentTab = e.currentTarget.dataset.index;
    this.setData({
      "item.currentTab": currentTab,
      pageIndex: 1,
      orderList: []
    })
    // this.renderOrderList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
  },

  bindscrolltolowerFn(e) {
    console.log('加载', e)
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