// pages/mine/integral/integral.js
let that;
let app = getApp();
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
    },
    pageNum: 1,
    pageSize: 20
  },
  cutIntegralFn() {
    wx.navigateTo({
      // url: 'cutIntegral/cutIntegral',
      url: 'cutDetail/cutDetail?integral=' + that.data.item.integral,
    })
  },
  tabNav(e) {
    let currentTab = e.currentTarget.dataset.index;
    this.setData({
      "item.currentTab": currentTab,
      pageNum: 1,
      "item.recordList": []
    })
    if (currentTab == 0) {
      that.articleFn();
    } else {
      that.recordFn(that.data.pageNum);
    }
  },

  async recordFn(pageNum) {
    let result = await (app.http.Record({
      customerId: wx.getStorageSync('customerId'),
      pageNum,
      pageSize: that.data.pageSize
    }));
    console.log(result, '兑换记录');
    that.setData({
      "item.recordList": that.data.item.recordList.concat(result.data.records.list),
      pageNum,
      total: result.data.records.total
    })
  },

  selectTicket(e) {
    console.log('选择的优惠券', e);
    that.setData({
      "item.ticketIndex": e.currentTarget.dataset.index,
      articleId: e.currentTarget.dataset.id
    })
  },

  // 确认兑换
  conversionFn() {
    if (!that.data.articleId) {
      wx.showToast({
        title: '请先选择兑换商品',
        icon: 'none',
        duration: 2000
      })
      return
    }
    app.http.Exchange({
      articleId: that.data.articleId,
      customerId: wx.getStorageSync('customerId')
    }).then(res => {
      that.articleFn();
      this.mask.util('open');
    }).catch(err => {

    })
  },

  statusNumberFn: e => {
    console.log(e);
    if (e.detail.status == 0) {
      wx.switchTab({
        url: '/pages/home/home',
      })
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.mask = this.selectComponent('#mask');
  },

  async articleFn() {
    let result = await (app.http.Article({
      customerId: wx.getStorageSync('customerId')
    }));
    console.log(result, '积分');
    that.setData({
      "item.integral": result.data.integral,
      "item.articles": result.data.articles
    })
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
    that.articleFn();
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