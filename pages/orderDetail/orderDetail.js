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
    let bol=dayjs().isBefore(dayjs('2022-02-11'));
    console.log(bol)
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
    that.setData({
      // overallPrice,
      order: data
    })
  },

  async cancelOrderFn() {
    Dialog.confirm({
      title: '取消订单',
      message: '您确认取消当前订单吗？',
      theme: 'round-button',
    }).then(() => {
      // let {data} = await(app.http.Cancel({orderId:that.data.orderId}))
    }).catch(() => {

    });
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