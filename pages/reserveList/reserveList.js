// pages/reserveList/reserveList.js
let that;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  bindPlusFn(e) {
    console.log('加', e);
    that.addSubtractFn();
    that.setData({
      start: 'start'
    });
    setTimeout(function () {
      that.setData({
        start: ''
      });
    }, 200)
  },

  bindMinus(e) {
    console.log('减', e);
    that.addSubtractFn();
  },

  addSubtractFn() {
    // this.cartWwing();
    
  },

  async shopListFn() {
    let {
      data
    } = await (app.http.Prepare({
      deviceId: '1346017173243428864'
    }))
    console.log('商品信息', data);
    that.setData({
      device: data
    })
  },

  gotoOrder() {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.shopListFn();
  },

  cartWwing: function () {
    var animation = wx.createAnimation({
      duration: 100, //动画持续时间
      timingFunction: 'ease-in', //动画以低速开始
    })
    animation.translateX(6).rotate(21).step()
    animation.translateX(-6).rotate(-21).step()
    animation.translateX(0).rotate(0).step()
    this.setData({
      ani: animation.export()
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