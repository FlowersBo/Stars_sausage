// pages/discountCoupon/discountCoupon.js
const app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fatherList: [{
        tabsName: "可用",
        list: [{
          name: '哈哈哈哈哈'
        }]

      },
      {
        tabsName: "过期",
        list: [{
          name: '呵呵呵呵呵'
        }]
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

  async couponListFn() {
    let result = await (app.http.CouponList({
      isShow: 0,
      customerId: wx.getStorageSync('customerId')
    }));
    console.log(result)
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