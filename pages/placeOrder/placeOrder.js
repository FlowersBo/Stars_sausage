// pages/placeOrder/placeOrder.js
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
      orderId: options.orderId,
      distance: options.distance
    })
    that.confirmFn();
  },

  async confirmFn() {
    let {
      data
    } = await (app.http.confirm({
      orderId: that.data.orderId
    }));
    let overallPrice = 0,
      price = 0,
      productQuantity = 0;
    data.detail.forEach(element => {
      price += Number(element.price);
      productQuantity += JSON.parse(element.quantity)
    });
    overallPrice = price.toFixed(2)
    that.setData({
      product: data,
      overallPrice,
      productQuantity
    })
  },


  async wxPayFn() {
    let {
      data
    } = await (app.http.pay(
      that.data.orderId
    ));
    console.log('支付', data)
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success(res) {
        console.log(res)
        wx.redirectTo({
          url: './accomplishOrder/accomplishOrder?orderId=' + that.data.orderId,
        })
      },
      fail(res) {
        wx.showToast({
          title: '支付失败',
          icon: 'error',
          duration: 2000
        })
      }
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