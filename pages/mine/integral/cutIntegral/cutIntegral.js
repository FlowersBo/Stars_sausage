// pages/mine/integral/cutIntegral/cutIntegral.js
let app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {
      scrollbar: false,
      currentTab: 0,
      nav: ['转赠记录', '接收记录'],
      navIndex:1,
      recordList: []
    },
    pageNum: 1,
    pageSize: 10
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
      pageNum: 1,
      "item.recordList": []
    })
    that.recordFn(that.data.pageNum);
  },

  async recordFn(pageNum) {
    let result = await (app.http.PresentRecord({
      customerId: wx.getStorageSync('customerId'),
      pageNum,
      pageSize: that.data.pageSize,
      changeType: `${that.data.item.currentTab==0?'2':'1'}`
    }));
    console.log(result, '转赠记录');
    that.setData({
      "item.recordList": that.data.item.recordList.concat(result.data.records.list),
      pageNum,
      total: result.data.records.total
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      'item.integral': options.integral,
      isDisabled: false
    })
    that.recordFn(that.data.pageNum);
  },

  bindscrolltolowerFn(e) {
    let pageNum = that.data.pageNum;
    let pageSize = that.data.pageSize;
    if (that.data.total <= pageSize * pageNum) {
      return
    }
    that.recordFn(pageNum + 1);
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