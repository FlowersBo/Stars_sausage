// pages/orderDetail/orderDetail.js
let that;
const app = getApp();
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
    that.setData({
      orderId: options.orderId
    })
    that.orderDetailFn(options.orderId);
  },

  async orderDetailFn(orderId) {
    let {
      data
    } = await (app.http.Detail({
      orderId: '1491289808725606400'
    }));
    console.log('订单详情', data);
    // let overallPrice = 0,
    //   price = 0;
    // data.detail.forEach(element => {
    //   price += Number(element.price);
    // });
    // overallPrice = price.toFixed(2)
    that.setData({
      // overallPrice,
      order: data
    })
  },

  async cancelOrderFn(){
    let {data} = await(app.http.Cancel({orderId:that.data.orderId}))
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