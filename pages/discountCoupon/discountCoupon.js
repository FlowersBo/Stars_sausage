// pages/discountCoupon/discountCoupon.js
const app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: 0,
    fatherList: [{
        tabsName: "可用",
        list: []

      },
      {
        tabsName: "过期",
        list: []
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.couponListFn();
  },
  onClick(e) {
    that.setData({
      isShow: e.detail.index
    })
    that.couponListFn();
  },

  async couponListFn() {
    let result = await (app.http.CouponList({
      isShow: that.data.isShow,
      customerId: wx.getStorageSync('customerId')
    }));
    console.log(result)
    if (result.code === 200) {
      that.setData({
        [`fatherList[${that.data.isShow}].list`]: result.data.list
      })
    }
  },
  useCountFn(e){
    console.log(e)
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  
    prevPage.setData({
      couponId: e.target.dataset.couponid
    })
    wx.navigateBack({
      delta: 1,
    })
    // let countId = e.target.dataset.countid;
    // wx.redirectTo({
    //   url: '/pages/placeOrder/placeOrder?countId='+countId
    // })
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