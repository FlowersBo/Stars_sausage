// pages/mine/integral/integral.js
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {
      scrollbar: false,
      currentTab: 0,
      nav: ['商品兑换', '兑换记录'],
      navIndex: 0,
      ticketIndex: '',
      openSetting: true
    }
  },
  cutIntegralFn() {
    wx.navigateTo({
      // url: 'cutIntegral/cutIntegral',
      url: 'cutDetail/cutDetail',
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

  selectTicket(e) {
    console.log('选择的优惠券', e);
    that.setData({
      "item.ticketIndex": e.currentTarget.dataset.index
    })
  },

  // 确认兑换
  conversionFn() {
    this.mask.util('open');
  },

  statusNumberFn: e => {
    console.log(e);
    if(e.detail.status==0){

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.mask = this.selectComponent('#mask');
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