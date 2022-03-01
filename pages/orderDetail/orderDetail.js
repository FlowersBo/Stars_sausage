// pages/orderDetail/orderDetail.js
let that;
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import {
  getDate
} from '../../utils/util';
let dayjs = require('dayjs')
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
    let bol = dayjs().isBefore(dayjs('2022-02-11'));
    console.log(bol)
    console.log(options.orderId)
    that.setData({
      orderId: options.orderId
    })
  },

  async orderDetailFn(orderId) {
    let {
      data
    } = await (app.http.Detail({
      orderId
    }));
    // let overallPrice = 0,
    //   price = 0;
    // data.detail.forEach(element => {
    //   price += Number(element.price);
    // });
    // overallPrice = price.toFixed(2)
    data.order.orderdate = getDate(data.order.orderdate);
    if (data.order.shipDate) {
      data.order.shipDate = getDate(data.order.shipDate);
    }
    console.log('订单详情', data);
    wx.hideLoading()
    wx.hideNavigationBarLoading() //在标题栏中隐藏加载
    wx.stopPullDownRefresh()
    that.setData({
      // overallPrice,
      order: data,
      commodityImg: data.detail[0].pictureUrl,
      pointName: data.pointName,
    })
  },

  cancelOrderFn() {
    Dialog.confirm({
      title: '取消订单',
      message: '您确认取消当前订单吗？',
      theme: 'round-button',
    }).then(() => {
      app.http.Cancel(
          that.data.orderId
        )
        .then(res => {
          console.log(res)
          if (res.code === 200) {
            wx.showToast({
              title: '取消成功',
              icon: 'none',
              duration: 1000
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          }
        })
    }).catch(err => {
      console.log(err)
    });
  },

  makePhoneFn() {
    wx.makePhoneCall({
      phoneNumber: '4008800975',
      fail(err) {

      }
    })
  },

  gotoEvaluateFn() {
    wx.navigateTo({
      url: '../evaluate/evaluate?orderId=' + that.data.orderId + '&commodityImg=' + that.data.commodityImg + '&pointName=' + that.data.pointName,
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
    that.orderDetailFn(that.data.orderId);
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
    that.orderDetailFn(that.data.orderId);
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