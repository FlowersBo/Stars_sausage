// pages/placeOrder/placeOrder.js
let that;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponId: '',
  },

  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },

  // onClick(event) {
  //   const {
  //     name
  //   } = event.currentTarget.dataset;
  //   this.setData({
  //     radio: name,
  //   });
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.log(options)
    that.setData({
      orderId: options.orderId,
      distance: options.distance
    })
  },

  async confirmFn() {
    let {
      data
    } = await (app.http.Confirm({
      orderId: that.data.orderId,
      couponId: that.data.couponId
    }));
    let overallPrice = 0,
      price = 0,
      productQuantity = 0;
    data.detail.forEach(element => {
      price += Number(element.price);
      productQuantity += JSON.parse(element.quantity)
    });
    if (data.coupon) {
      let couponMoney = Number(data.couponMoney)
      if (price - couponMoney <= 0) {
        overallPrice = 0;
      }
      overallPrice = (price - couponMoney).toFixed(2);
      that.setData({
        couponId: data.coupon.id
      })
    } else {
      overallPrice = price.toFixed(2);
    }
    that.setData({
      product: data,
      overallPrice,
      productQuantity,
      price,
      radio: `${data.balance==0?'2':'1'}`
    })
  },


  async wxPayFn() {
    let {
      data
    } = await (app.http.pay({
      orderId: that.data.orderId,
      couponId: that.data.couponId,
      useAccount: `${that.data.radio==='1'?true:false}`
    }));
    console.log('支付', data)
    if (data.payType == 2) {
      wx.redirectTo({
        url: './accomplishOrder/accomplishOrder?orderId=' + that.data.orderId,
      })
      return
    }
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
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },

  gotodiscountCoupon() {
    wx.navigateTo({
      url: '/pages/discountCoupon/discountCoupon',
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
    that.confirmFn();
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