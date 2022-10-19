// pages/placeOrder/placeOrder.js
let that;
const app = getApp();
const deraulHours = ['00点', '01点', '02点', '03点', '04点', '05点', '06点', '07点', '08点', '09点', "10点", "11点", "12点", "13点", "14点", "15点", "16点", "17点", "18点", "19点", "20点", "21点", "22点", "23点"];
const deraulMinutes = ['00分', '01分', '02分', '03分', '04分', '05分', '06分', '07分', '08分', '09分', "10分", "11分", "12分", "13分", "14分", "15分", "16分", "17分", "18分", "19分", "20分", "21分", "22分", "23分", "24分", "25分", "26分", "27分", "28分", "29分", "30分", "31分", "32分", "33分", "34分", "35分", "36分", "37分", "38分", "39分", "40分", "41分", "42分", "43分", "44分", "45分", "46分", "47分", "48分", "49分", "50分", "51分", "52分", "53分", "54分", "55分", "56分", "57分", "58分", "59分"];
const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const dayjs = require('dayjs');
const dateList = new Array(33).fill(1).map((item, idx) => {
  const currentDay = dayjs().add(idx, 'days');
  return {
    time: currentDay.format('YYYY-MM-DD'),
    // name: `${currentDay.format('MM月DD日')} ${idx === 0 ? '明日' : weeks[currentDay.day()]}`
    name: `${currentDay.format('MM月DD日')} ${weeks[currentDay.day()]}`
  };
})
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

  onChangeTime() {
    that.setData({
      popMeetShow: true,
    })
    // const valueOf = 1 * 3600000;
    // console.log(dayjs(dayjs().valueOf() + valueOf))
    const startTime = dayjs(dayjs().valueOf());
    this.startTime = startTime;
    let _timeValues = [];
    let dayTime = new Array(2).fill(1).map((item, idx) => {
      const currentDay = startTime.add(idx, 'days');
      _timeValues.push(currentDay.format('YYYY-MM-DD'));
      this._timeValues = _timeValues;
      return `${currentDay.format('MM月DD日')} ${idx === 0 ? '今日' : weeks[currentDay.day()]}`
      // return `${currentDay.format('MM月DD日')} ${weeks[currentDay.day()]}`
    })
    let meetColumns = new Array(3).fill(1);
    meetColumns[0] = {
      values: dayTime
    }
    let endTime = dayjs(dayjs().valueOf() + 1860000);
    this.endTime = endTime;
    if (endTime) {
      meetColumns[1] = {
        values: deraulHours.slice(Number(endTime.format('H')))
      }
      meetColumns[2] = {
        values: deraulMinutes.slice(Number(endTime.format('m')))
      }
    }
    that.setData({
      meetColumns
    })
  },

  onStartTimeChange(e) {
    console.log('时间弹窗', e)
    const currentColumn = e.detail.value;
    const index = e.detail.index;
    console.log(this.endTime)
    if (index === 0) {
      if (this.data.meetColumns[0].values.indexOf(currentColumn[0])) {
        this.data.meetColumns[1] = {
          values: deraulHours
        };
        this.data.meetColumns[2] = {
          values: deraulMinutes
        };
      } else {
        this.data.meetColumns[1] = {
          values: deraulHours.slice(Number(this.endTime.format('H')))
        }
        this.data.meetColumns[2] = {
          values: deraulMinutes.slice(Number(this.endTime.format('m')))
        }
      }
    }
    if (index === 1) {
      if (this.data.meetColumns[0].values.indexOf(currentColumn[0]) === 0 && this.data.meetColumns[1].values.indexOf(currentColumn[1]) === 0) {
        this.data.meetColumns[2] = {
          values: deraulMinutes.slice(Number(this.startTime.format('m')))
        }
      } else {
        this.data.meetColumns[2] = {
          values: deraulMinutes
        };
      }
    }
    this.setData({
      meetColumns: this.data.meetColumns
    })
  },

  onClose() {
    this.setData({
      popMeetShow: false,
    })
  },
  getTime() {
    const currentStartTimePicker = this.selectComponent("#start-time-picker");
    console.log(currentStartTimePicker.getIndexes()[0])
    this._startTime = `${this._timeValues[currentStartTimePicker.getIndexes()[0]]} ${currentStartTimePicker.getValues()[1].replace('点', '')}:${currentStartTimePicker.getValues()[2].replace('分', '')}:00`
    let timer = currentStartTimePicker.getValues().join(' ');
   console.log(this._startTime)
   that.setData({
    timer,

   })
    this.onClose();
  },
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
    console.log('当前时间', dayjs().format('YYYY-MM-DD HH:mm:ss'))
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