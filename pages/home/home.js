// index.js
let that;
const app = getApp()
Page({
  data: {
    imgarr: [{
        bannerImg: '/assets/img/1.png',
        bannerUrl: 'https://www.baidu.com'
      },
      {
        bannerImg: '/assets/img/2.png',
        bannerUrl: 'https://www.baidu.com'
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

  gotoUrl(e) {
    console.log(e)
    let url = e.currentTarget.dataset.bannerurl;
    wx.navigateTo({
      url,
    })
  },

  async bannerFn() {
    let {
      data
    } = await (app.http.Banner())
  },

  onLoad() {
    that = this;
    wx.login({
      success: res => {
        console.log(res)
      }
    })
    // that.bannerFn();
  },

  onShow() {
    this.getTabBar().setData({
      selected: 0
    })
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