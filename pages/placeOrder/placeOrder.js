// pages/placeOrder/placeOrder.js
let that;
const app = getApp();
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
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
    timeRadio: '1',
    timer: '',
    isDisabled: true
  },

  bindgetuserinfo(e) {
    console.log('用户信息', e)
  },

  timeRadioChange(event) {
    that.setData({
      timeRadio: event.detail
    });
    that._startTime='';
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
    setTimeout(function () {
      const currentStartTimePicker = that.selectComponent("#start-time-picker");
      currentStartTimePicker.setColumnIndex(0, 0);
      currentStartTimePicker.setColumnIndex(1, 0);
      currentStartTimePicker.setColumnIndex(2, 0);
    }, 10)
    let startOpen = that.data.startOpen,
      endOpen = that.data.endOpen;
    // const valueOf = 1 * 3600000;
    // console.log(dayjs(dayjs().valueOf() + valueOf))
    const startTime = dayjs(dayjs().valueOf());
    this.startTime = startTime;
    let _timeValues = [];
    let statusMinuteValues = [];
    let endMinuteValues = [];
    let dayTime = new Array(2).fill(1).map((item, idx) => {
      const currentDay = startTime.add(idx, 'days');
      _timeValues.push(currentDay.format('YYYY-MM-DD'));
      this._timeValues = _timeValues;
      return `${currentDay.format('MM月DD日')} ${idx === 0 ? '今日' : weeks[currentDay.day()]}`
      // return `${currentDay.format('MM月DD日')} ${weeks[currentDay.day()]}`
    })
    _timeValues.forEach(element => {
      return statusMinuteValues.push(dayjs(dayjs(element + ' ' + startOpen).valueOf() + 5460000))
    });
    _timeValues.forEach(element => {
      return endMinuteValues.push(dayjs(dayjs(element + ' ' + endOpen).valueOf() - 5460000))
    });
    console.log('营业', statusMinuteValues);
    console.log('停业', endMinuteValues);
    this.statusMinuteValues = statusMinuteValues;
    this.endMinuteValues = endMinuteValues;
    let meetColumns = new Array(3).fill(1);
    meetColumns[0] = {
      values: dayTime,
      defaultIndex: 0
    }
    let endTime = dayjs(dayjs().valueOf() + 1860000);
    // console.log(dayjs().hour(14))
    // console.log(dayjs().minute(30))
    this.endTime = endTime;
    console.log(dayjs().valueOf() + 1860000 > dayjs(dayjs().format('YYYY-MM-DD') + ' ' + endOpen).valueOf() - 5460000)
    if (dayjs().valueOf() + 1860000 > dayjs(dayjs().format('YYYY-MM-DD') + ' ' + endOpen).valueOf() - 5460000) {
      meetColumns[0].values = meetColumns[0].values.slice(1)
      meetColumns[1] = {
        values: deraulHours.slice(Number(statusMinuteValues[1].format('H')), Number(endMinuteValues[1].format('H')) + 1)
      }
      meetColumns[2] = {
        values: deraulMinutes.slice(Number(statusMinuteValues[1].format('m')))
      }
      console.log(Number(endMinuteValues[1].format('m')))
      that.setData({
        meetColumns
      })
      return
    }
    meetColumns[1] = {
      values: deraulHours.slice(`${dayjs().valueOf() > dayjs(dayjs().format('YYYY-MM-DD') + ' ' + startOpen).valueOf() + 1860000?Number(endTime.format('H')):Number(statusMinuteValues[0].format('H'))}`, Number(endMinuteValues[0].format('H')) + 1)
    }
    meetColumns[2] = {
      values: deraulMinutes.slice(`${dayjs().valueOf() > dayjs(dayjs().format('YYYY-MM-DD') + ' ' + startOpen).valueOf() + 1860000?Number(endTime.format('m')):Number(statusMinuteValues[0].format('m'))}`, `${deraulHours.slice(`${dayjs().valueOf() > dayjs(dayjs().format('YYYY-MM-DD') + ' ' + startOpen).valueOf() + 1860000?Number(endTime.format('H')):Number(statusMinuteValues[0].format('H'))}`, Number(endMinuteValues[0].format('H')) + 1).length==1?Number(endMinuteValues[0].format('m')):59+1}`)
    }
    that.setData({
      meetColumns
    })
  },

  onStartTimeChange(e) {
    const currentColumn = e.detail.value;
    const index = e.detail.index;
    let startOpen = that.data.startOpen;
    let currentStartTimePicker = that.selectComponent("#start-time-picker");
    if (index === 0) {
      currentStartTimePicker.setColumnIndex(1, 0);
      currentStartTimePicker.setColumnIndex(2, 0);
      if (this.data.meetColumns[0].values.indexOf(currentColumn[0])) { //1
        this.data.meetColumns[1] = {
          values: deraulHours.slice(Number(this.statusMinuteValues[1].format('H')), Number(this.endMinuteValues[1].format('H')) + 1)
        }
        this.data.meetColumns[2] = {
          values: deraulMinutes.slice(Number(this.statusMinuteValues[1].format('m')))
        }
        // this.data.meetColumns[1] = { values: deraulHours };
        // this.data.meetColumns[2] = { values: deraulMinutes };
      } else {
        this.data.meetColumns[1] = {
          values: deraulHours.slice(`${dayjs().valueOf() > dayjs(dayjs().format('YYYY-MM-DD') + ' ' + startOpen).valueOf() + 1860000?Number(this.endTime.format('H')):Number(this.statusMinuteValues[0].format('H'))}`, Number(this.endMinuteValues[0].format('H')) + 1)
        }
        this.data.meetColumns[2] = {
          values: deraulMinutes.slice(`${dayjs().valueOf() > dayjs(dayjs().format('YYYY-MM-DD') + ' ' + startOpen).valueOf() + 1860000?Number(this.endTime.format('m')):Number(this.statusMinuteValues[0].format('m'))}`, `${deraulHours.slice(`${dayjs().valueOf() > dayjs(dayjs().format('YYYY-MM-DD') + ' ' + startOpen).valueOf() + 1860000?Number(this.endTime.format('H')):Number(this.statusMinuteValues[0].format('H'))}`, Number(this.endMinuteValues[0].format('H')) + 1).length==1?Number(this.endMinuteValues[0].format('m')):59+1}`)
        }
        // this.data.meetColumns[1] = {
        //   values: deraulHours.slice(Number(this.endTime.format('H')))
        // }
        // this.data.meetColumns[2] = {
        //   values: deraulMinutes.slice(Number(this.endTime.format('m')))
        // }
      }
    }
    if (index === 1) {
      console.log(this.data.meetColumns[1].values.indexOf(currentColumn[1]))
      if (this.data.meetColumns[0].values.indexOf(currentColumn[0]) === 0 && this.data.meetColumns[1].values.indexOf(currentColumn[1]) === 0) {
        this.data.meetColumns[2] = {
          values: deraulMinutes.slice(`${dayjs().valueOf() > dayjs(dayjs().format('YYYY-MM-DD') + ' ' + startOpen).valueOf() + 1860000?Number(this.endTime.format('m')):Number(this.statusMinuteValues[0].format('m'))}`, `${deraulHours.slice(`${dayjs().valueOf() > dayjs(dayjs().format('YYYY-MM-DD') + ' ' + startOpen).valueOf() + 1860000?Number(this.endTime.format('H')):Number(this.statusMinuteValues[0].format('H'))}`, Number(this.endMinuteValues[0].format('H')) + 1).length==1?Number(this.endMinuteValues[0].format('m')):59+1}`)
        }
        // this.data.meetColumns[2] = {
        //   values: deraulMinutes.slice(Number(this.startTime.format('m')))
        // }
      } else {
        this.data.meetColumns[2] = {
          values: deraulMinutes.slice(`${currentStartTimePicker.getColumnIndex(1)==0?Number(this.statusMinuteValues[1].format('m')):0}`, `${currentStartTimePicker.getColumnIndex(1)==currentStartTimePicker.getColumnValues(1).length-1?Number(this.endMinuteValues[1].format('m'))+1:59+1}`)
        }
        // this.data.meetColumns[2] = {
        //   values: deraulMinutes
        // };
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
    this._startTime = `${this._timeValues[currentStartTimePicker.getIndexes()[0]]} ${currentStartTimePicker.getValues()[1].replace('点', '')}:${currentStartTimePicker.getValues()[2].replace('分', '')}:00`;
    let timer = currentStartTimePicker.getValues().join(' ');
    console.log(this._startTime)
    console.log(timer)
    that.setData({
      timer,
      isDisabled: false,
      timeRadio: '2'
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
    that.confirmFn();
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
      // price = 0,
      productQuantity = 0;
    overallPrice = (Number(data.couponMoney) + Number(data.cardFreeAmount)).toFixed(2);
    data.detail.forEach(element => {
      // price += Number(element.price);
      productQuantity += JSON.parse(element.quantity)
    });
    // if (data.coupon) {
    //   let couponMoney = Number(data.couponMoney)
    //   if (price - couponMoney <= 0) {
    //     overallPrice = 0;
    //   }
    //   overallPrice = (price - couponMoney).toFixed(2);
    //   that.setData({
    //     couponId: data.coupon.id
    //   })
    // } else {
    //   overallPrice = price.toFixed(2);
    // }
    if (data.coupon) {
      that.setData({
        couponId: data.coupon.id
      })
    }
    that.setData({
      product: data,
      startOpen: data.startOpen,
      endOpen: data.endOpen,
      overallPrice,
      productQuantity,
      // price,
      radio: `${data.balance==0?'2':'1'}`,
      norm: data.cardAfterAmount
    })
  },


  wxPayFn() {
    Dialog.confirm({
      title: '确认付款',
      message: '烤肠下单烤制后将无法取消订单',
      theme: 'round-button',
    }).then(() => {
      app.http.pay({
          orderId: that.data.orderId,
          couponId: that.data.couponId,
          roastTime: that._startTime?that._startTime:'',
          useAccount: `${that.data.radio==='1'?true:false}`
        })
        .then(res => {
          console.log('支付', res)
          if (res.data.payType == 2) {
            wx.redirectTo({
              url: './accomplishOrder/accomplishOrder?orderId=' + that.data.orderId,
            })
            return
          }
          wx.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: res.data.signType,
            paySign: res.data.paySign,
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
        }).catch(() => {
          wx.navigateBack({
            delta: 1,
          })
        })
    }).catch(() => {})
  },

  gotodiscountCoupon() {
    wx.navigateTo({
      url: '/pages/discountCoupon/discountCoupon?norm=' + that.data.norm,
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
    // that.confirmFn();
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