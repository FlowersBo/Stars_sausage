// index.js
let that;
const app = getApp()
let QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
let qqmap;
Page({
  data: {
    imgarr: [{
        bannerImg: '/assets/img/1.png',
        bannerUrl: 'https://www.autohome.com.cn'
      },
      {
        bannerImg: '/assets/img/2.png',
        bannerUrl: 'https://www.zhihu.com'
      },
      {
        bannerImg: '/assets/img/3.png',
        bannerUrl: 'https://www.baidu.com'
      },
      {
        bannerImg: '/assets/img/4.png',
        bannerUrl: 'https://www.baidu.com'
      },
    ],
    Height: "", //这是swiper要动态设置的高度属性
    isFlag: true,
    isBtn: true
  },
  imgHeight(e) {
    console.log(e)
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
    var imgh = e.detail.height; //图片高度
    var imgw = e.detail.width; //图片宽度
    var swiperH = winWid * imgh / imgw + "px" //等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    this.setData({
      Height: swiperH //设置高度
    })
  },


  async bannerFn() {
    let {
      data
    } = await (app.http.Banner({
      type: 1
    }));
    console.log('轮播', data);
    that.setData({
      bannerList: data
    })
  },

  async activityFn() {
    let {
      data
    } = await (app.http.Banner({
      type: 2
    }));
    console.log('活动图', data);
    that.setData({
      activityList: data
    })
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
            // if (!res.data.phone) {
            //   this.mask.util('open');
            //   app.http.Np({})
            //     .then(res => {
            //       console.log('新人券', res)
            //       if (res.code == 200) {
            //         that.setData({
            //           ticket: res.data
            //         })
            //       } else {
            //         this.mask.util('close');
            //         wx.showToast({
            //           title: res.msg,
            //           icon: 'none',
            //           duration: 2000
            //         })
            //       }
            //     }).catch(err => {

            //     })
            // }
          })
      }
    })
  },

  gotoReserveList(e) {
    console.log(e)
    if (!wx.getStorageSync('isLoaction')) {
      wx.setStorageSync('isLoaction', true);
      that.getSelfLocation();
      return
    }
    if (e.currentTarget.dataset.index === 0) {
      wx.navigateToMiniProgram({
        appId: 'wx41a8aabec46e8080',
        //wx8ab6fcdcbc881c7d
        // path: 'page/index/index?id=123',
        // extraData: {
        //   foo: 'bar'
        // },
        // envVersion: 'develop',
        success(res) {
          // 打开成功
          console.log('打开成功', res)
        }
      })
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.bannerurl
      })
    }
  },

  //获取位置
  getSelfLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res)
        const loaction = {};
        loaction.latitude = res.latitude;
        loaction.longitude = res.longitude;
        // loaction.latitude = 39.95837890625;
        // loaction.longitude = 116.49010823567708;
        wx.setStorageSync('loaction', loaction);
        that.getUserLocation(loaction.latitude, loaction.longitude);
      },
      fail: function (res) {
        wx.getSetting({
          success: (res) => {
            if (!res.authSetting['scope.userLocation']) {
              that.dialogFn();
            }
          }
        })
      }
    });
  },

  // 获取用户当前位置
  getUserLocation(latitude, longitude) {
    qqmap.reverseGeocoder({ //逆地址解析（经纬度 ==> 坐标位置）
      location: {
        latitude,
        longitude
      },
      success(res) {
        console.log(res);
        let adcode = res.result.ad_info.adcode;
        // adcode = adcode.slice(0,4)
        wx.setStorageSync('adcode', adcode);
        wx.setStorageSync('province', res.result.ad_info.province);
      }
    })
  },

  dialogFn() {
    Dialog.confirm({
      title: '位置信息授权',
      message: '您需要授权位置信息获取附近点位',
      theme: 'round-button',
      confirmButtonOpenType: 'openSetting'
    }).then(() => {

    }).catch(() => {
      wx.setStorageSync('isLoaction', false);
    });
  },

  onLoad(options) {
    // wx.getSetting({
    //   success(res) {
    //     if (!res.authSetting['scope.addPhoneCalendar']) {
    //       wx.authorize({
    //         scope: 'scope.addPhoneCalendar',
    //         success() {
    //           wx.addPhoneCalendar({
    //             title: '日程',
    //             startTime: (new Date()).getTime() / 1000,
    //             description: "日程内容",
    //             alarm: 'true',
    //             alarmOffset: 3000,
    //             success: () => {
    //               console.log('addCalendar is ok')
    //             },
    //             fail: (res) => {
    //               console.log(res)
    //             },
    //             complete: (res) => {
    //               console.log(res)
    //             }
    //           })
    //         }
    //       })
    //     }
    //   }
    // })

    that = this;
    this.mask = this.selectComponent('#mask');
    qqmap = new QQMapWX({
      key: '6UXBZ-3HTWX-MMW4G-TX4UC-RP2U6-K7B4V'
    })
    console.log('跳转拿到参数', options);
    let mpOpenId = options.mpOpenId;
    if (!mpOpenId) {
      mpOpenId = '';
    }
    that.setData({
      mpOpenId
    })
    that.authFn(that.data.mpOpenId);
    Promise.allSettled([
        that.bannerFn(),
        that.activityFn()
      ]).then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  },

  // mask返回
  statusNumberFn: e => {
    console.log(e)
  },

  onShow() {
    this.getTabBar().setData({
      selected: 0
    });
    if (wx.getStorageSync('isLoaction')) {
      console.log('调用地址')
      that.getSelfLocation();
    };
  },
  onHide() {
    // this.mask.util('close');
  },

  // onShareAppMessage:function () {
  //   return {
  //     title: '星斗烤肠研究院',
  //     // imageUrl: '/public/img/cat.jpg',
  //     path: '/pages/home/home'
  //   };
  // },




  // getUserProfile(e) {
  //   wx.getUserProfile({
  //     desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
  //     success: (res) => {
  //       console.log(res)
  //       this.setData({
  //         userInfo: res.userInfo,
  //         hasUserInfo: true
  //       })
  //     }
  //   })
  // },
})