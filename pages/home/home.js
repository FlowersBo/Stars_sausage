// index.js
let that;
const app = getApp()
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

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
    isFlag: true
  },

  // imgHeight(e) {
  //   console.log(e)
  //   var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
  //   var imgh = e.detail.height; //图片高度
  //   var imgw = e.detail.width; //图片宽度
  //   var swiperH = winWid * imgh / imgw + "px" //等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
  //   this.setData({
  //     Height: swiperH //设置高度
  //   })
  // },


  async bannerFn() {
    let {
      data
    } = await (app.http.Banner({
      type: 0
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
      type: 1
    }));
    console.log('活动图', data);
    that.setData({
      activityList: data
    })
  },

  authFn(mpOpenId = '') {
    wx.login({
      success: res => {
        app.http.Auth({
            code: res.code,
            mpOpenId
          })
          .then(res => {
            wx.setStorageSync('customerId', res.data.id)
          })
      }
    })
  },

  gotoReserveList(e) {
    console.log(e)
    if (!wx.getStorageSync('isLoaction')) {
      console.log('没有')
      wx.setStorageSync('isLoaction', true);
      that.getSelfLocation();
      return
    }
    let url = e.currentTarget.dataset.bannerurl;
    wx.navigateTo({
      url
    })
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
        wx.setStorageSync('loaction', loaction);
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

  dialogFn() {
    Dialog.confirm({
      title: '位置信息授权',
      message: '需授权位置信息才能正常使用小程序功能',
      theme: 'round-button',
      confirmButtonOpenType: 'openSetting'
    }).then(() => {

    }).catch(() => {
      wx.setStorageSync('isLoaction', false);
    });
  },

  onLoad(options) {
    that = this;
    console.log('跳转拿到参数', options);
    let mpOpenId = options.mpOpenId;
    if(!mpOpenId){
      mpOpenId = '';
    }
    Promise.allSettled([
        that.authFn(mpOpenId),
        that.bannerFn(),
        that.activityFn()
      ]).then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  },


  onShow() {
    this.getTabBar().setData({
      selected: 0
    })
    if (wx.getStorageSync('isLoaction')) {
      console.log('调用')
      that.getSelfLocation();
    }
  },






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