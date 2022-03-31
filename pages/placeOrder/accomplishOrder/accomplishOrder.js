// pages/placeOrder/accomplishOrder/accomplishOrder.js
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: true
  },

  gotoOrderDetail() {
    if(that.data.checked){
      wx.requestSubscribeMessage({
        tmplIds: [
          '2_NKjce9y1m8c7VIhgWpT4l4nnOMWlR6V7lD03QANsA',
          'I3naEtNu1kd1l6MjdH1Hn0FN5LRY5X4gmuieJdJvAz4'
        ],
        success(res) {
          console.log('成功', res);
          wx.reLaunch({
            url: '../../orderDetail/orderDetail?orderId=' + that.data.orderId,
          })
        },
        fail(res) {
          console.log('失败', res);
          wx.reLaunch({
            url: '../../orderDetail/orderDetail?orderId=' + that.data.orderId,
          })
        }
      })
    }else{
      wx.reLaunch({
        url: '../../orderDetail/orderDetail?orderId=' + that.data.orderId,
      })
    }
  },

  onChange() {
    that.setData({
      checked: !that.data.checked
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      orderId: options.orderId
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
  // onShareAppMessage: function () {

  // }
})