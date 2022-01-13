// pages/reserveList/reserveList.js
let that;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  bindPlusFn(e){
    console.log('加',e);
    that.addSubtractFn();
  },

  bindMinus(e){
    console.log('减',e);
    that.addSubtractFn();
  },

  addSubtractFn(){

  },

  async shopListFn(){
    let {data} = await(app.http.Prepare({deviceId: '1346017173243428864'}))
    console.log('商品信息',data);
    that.setData({
     device: data
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.shopListFn();
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