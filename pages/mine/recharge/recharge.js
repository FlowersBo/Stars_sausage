// pages/mine/recharge/recharge.js
let that;
let app = getApp();
import {
  formatTime
} from '../../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    pageSize: 20
  },

  changeSum(e) {
    that.setData({
      changeIndex: e.currentTarget.dataset.index,
      changeMoney: e.currentTarget.dataset.money,
      rechargeId: e.currentTarget.dataset.rechargeid
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.recordFn(that.data.pageNum);
  },

  async recordFn(pageNum) {
    let result = await (app.http.MoneyList({
      customerId: wx.getStorageSync('customerId'),
      pageNum,
      pageSize: that.data.pageSize
    }));
    console.log('充值页面', result);
    let orderList = result.data.orders.list,
      rechargeInfos = result.data.rechargeInfos;
    orderList.forEach(element => {
      element.createDate = formatTime(new Date(element.createDate), 'min');
    });
    rechargeInfos.forEach((element, key) => {
      if (element.hot) {
        that.setData({
          changeIndex: key,
          changeMoney: element.amount,
          rechargeId: element.id
        })
      }
    });
    that.setData({
      pageNum,
      orderList,
      rechargeInfos
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

  conversionFn() {
    if (!that.data.changeMoney) {
      wx.showToast({
        title: '请选择充值金额',
        icon: 'none',
        duration: 2000
      })
      return
    }
    app.http.PayMoney({
        customerId: wx.getStorageSync('customerId'),
        rechargeId: that.data.rechargeId
      }).then(res => {
        console.log('支付返回', res);
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success(res) {
            wx.switchTab({
              url: '/pages/mine/mine'
            })
          },
          fail(res) {
            wx.showToast({
              title: '充值失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      })
      .catch(err => {
        wx.showToast({
          title: err.msg,
          icon: 'none',
          duration: 2000
        })
      })
    // wx.showModal({
    //   title: '提示',
    //   content: `您确定充值${that.data.changeMoney}元吗？`,
    //   success (res) {
    //     if (res.confirm) {

    //     } 
    //   }
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