// pages/mine/rechargeVip/rechargeVip.js
let that;
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openSetting: true,
    isVip: '1',
  },

  changeSum(e) {
    that.setData({
      changeIndex: e.currentTarget.dataset.index,
      changeMoney: e.currentTarget.dataset.money,
      cardId: e.currentTarget.dataset.cardid
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.mask = this.selectComponent('#mask');
    that.vipMoneyListFn();
  },

  async vipMoneyListFn() {
    let result = await (app.http.VipMoneyList({
      customerId: wx.getStorageSync('customerId')
    }));
    console.log('金额', result)
    that.setData({
      cardMoney: result.data.cards
    })
  },

  // 支付
  conversionFn() {
    if (that.data.changeIndex >= 0) {
      this.mask.util('open');
    } else {
      wx.showToast({
        title: '请选择开通时长',
        icon: 'none',
        duration: 2000
      })
    }
  },

  statusNumberFn: e => {
    console.log(e);
    if (e.detail.status == 0) {
      if (that.data.isVip === '1') {
        app.http.VipPayMoney({
            customerId: wx.getStorageSync('customerId'),
            cardId: that.data.cardId
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
      } else {

      }
    }
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