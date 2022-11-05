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
      cardId: e.currentTarget.dataset.cardid,
      memo: that.data.cardMoney[e.currentTarget.dataset.index].memo
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    this.mask = this.selectComponent('#mask');
    let scene = options.scene ? options.scene : '';
    console.log(options);
    scene = decodeURIComponent(scene);
    let cardId = scene.split(',')[0];
    let sceneType = scene.split(',')[1];
    console.log('截取参数', cardId, sceneType);
    // cardId = '222'
    console.log('参数', cardId);
    that.setData({
      cardId
    })
    that.authFn();
  },

  authFn(mpOpenId = '') {
    console.log('传参', mpOpenId)
    wx.login({
      success: res => {
        app.http.Auth({
            code: res.code,
            mpOpenId
          })
          .then(res => {
            wx.setStorageSync('customerId', res.data.id);
            wx.setStorageSync('phoneNumber', res.data.phone);
            that.vipMoneyListFn();
          })
      }
    })
  },

  async vipMoneyListFn() {
    let result = await (app.http.VipMoneyList({
      customerId: wx.getStorageSync('customerId'),
      cardId: that.data.cardId,
      sceneType: that.data.sceneType?that.data.sceneType:'',
    }));
    let cardMoney = result.data.cards;
    cardMoney.forEach((element, key) => {
      element.memo = element.memo.split('|')
      if (element.recommend) {
        that.setData({
          changeIndex: key,
          changeMoney: element.cardPrice,
          cardId: element.id,
        })
      }
    });
    console.log('金额', result)
    that.setData({
      cardMoney,
      groupId: result.data.groupId
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
            cardId: that.data.cardId,
            groupId: that.data.groupId?that.data.groupId:''
          }).then(res => {
            console.log('支付返回', res);
            wx.requestPayment({
              timeStamp: res.data.timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.package,
              signType: res.data.signType,
              paySign: res.data.paySign,
              success(res) {
                that.setData({
                  isVip: '2'
                })
                that.mask.util('open');
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
        wx.reLaunch({
          url: '/pages/reserveList/reserveList'
        })
      }
    } else {
      if (that.data.isVip === '2') {
        that.setData({
          isVip: '1'
        })
        that.onShareAppMessage();
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
    setTimeout(function () {
      wx.switchTab({
        url: '/pages/mine/mine'
      })
    }.bind(this), 1500)
    return {
      title: '我在预订烤肠，邀请你也来品尝一下吧~',
      path: '/pages/home/home',
      imageUrl: '/assets/img/vip.png'
    }
  }
})