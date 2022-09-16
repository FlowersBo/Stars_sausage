// custom-tab-bar/index.js
const app = getApp();
Component({
  data: {
    selected: null,
    list: []
  },
  // 生命周期
  attached() {

  },

  ready() {
    let list = this.data.list;
    list = [{
        pagePath: "/pages/home/home",
        text: "首页",
        iconPath: "/assets/tabbar/xiangchang.png",
        selectedIconPath: "/assets/tabbar/xiangchang-h.png"
      },
      {
        pagePath: "/pages/mine/mine",
        text: "我的",
        iconPath: "/assets/tabbar/dingdan.png",
        selectedIconPath: "/assets/tabbar/dingdan-h.png"
      }
    ]
    this.setData({
      list
    })
  },
  methods: {
    //切换tabbar
    switchTab(e) {
      const data = e.currentTarget.dataset;
      // app.globalData.selected = data.index;
      this.setData({
        selected: data.index
      })
      const url = data.path
      wx.switchTab({
        url
      })
    }
  }
})