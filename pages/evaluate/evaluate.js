// pages/evaluate/evaluate.js
let app = getApp();
let that;

function shuiyin(img) {
  wx.createSelectorQuery().select('#myCanvas').context(function (res) {
    console.log(res)
    let ctx = res.context;
    console.log(ctx)
    ctx.drawImage(img, 0, 0, 375, 375) //在画布上绘入图片，参数含义移步手册。
    ctx.rotate(45 * Math.PI / 180); //设置文字的旋转角度，角度为45°；

    //对斜对角线以左部分进行文字的填充
    for (let j = 1; j < 10; j++) { //用for循环达到重复输出文字的效果，这个for循环代表纵向循环
      ctx.beginPath();
      ctx.setFontSize(30);
      ctx.setFillStyle("rgba(255,255,255,.5)");

      ctx.fillText("水印", 0, 50 * j);
      for (let i = 1; i < 10; i++) { //这个for循环代表横向循环，
        ctx.beginPath();
        ctx.setFontSize(30);
        ctx.setFillStyle("rgba(255,255,255,.5)");
        ctx.fillText("zgu", 80 * i, 50 * j);
      }
    } //两个for循环的配合，使得文字充满斜对角线的左下部分

    //对斜对角线以右部分进行文字的填充逻辑同上
    for (let j = 0; j < 10; j++) {
      ctx.beginPath();
      ctx.setFontSize(30);
      ctx.setFillStyle("rgba(255,255,255,.5)");

      ctx.fillText("水印", 0, -50 * j);
      for (let i = 1; i < 10; i++) {
        ctx.beginPath();
        ctx.setFontSize(30);
        ctx.setFillStyle("rgba(255,255,255,.5)");
        ctx.fillText("水印", 80 * i, -50 * j);
      }
    }
    ctx.draw();
  }).exec()
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    starNum: 5,
    fieldVal: '',
    fieldVal: '',
    fileList: [],
    isShow: false
  },

  onChange(event) {
    this.setData({
      starNum: event.detail,
    });
  },

  fieldFn(e) {
    this.setData({
      fieldVal: e.detail,
    });
  },

  getInfo(e) {
    wx.getImageInfo({
      src: e,
      success(res) {
        console.log(res) //可以获取图片路径，图片长宽等信息
        // shuiyin(res.path)
      }
    })
  },

  afterRead(event) {
    that.setData({
      isShow: true
    })
    let i = 0;
    const {
      file
    } = event.detail;
    that.getInfo(file[0].url)
    console.log(file)
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    file.forEach(element => {
      wx.uploadFile({
        url: `${app.http.baseUrl}/reserve/common/upload`,
        filePath: element.url,
        name: 'file',
        formData: {
          user: 'test'
        },
        success(res) {
          i++;
          const {
            fileList = []
          } = that.data;
          fileList.push({
            ...element,
            url: JSON.parse(res.data).data
          });
          that.setData({
            fileList
          })
          if (i >= file.length) {
            that.setData({
              isShow: false
            })
          }
        },
      });
    });
  },

  readPhoto(event) {},

  deletePhoto(event) {
    let fileList = that.data.fileList;
    fileList.splice(event.detail.index, 1);
    that.setData({
      fileList
    })
    // fileList.forEach((element,key) => {
    //   if(element.url===event.detail.file.url){
    //     fileList.splice(key,1);
    //     that.setData({
    //       fileList
    //     })
    //     return false
    //   }
    // });
  },

  submitFrom() {
    let pic = [],
      fileList = that.data.fileList;
    fileList.forEach(element => {
      pic.push(element.url)
    });
    console.log(pic)
    app.http.Suggest({
        orderId: that.data.orderId,
        grade: that.data.starNum,
        content: that.data.fieldVal,
        pic
      })
      .then(res => {
        if (res.code == 200) {
          wx.navigateBack({
            delta: 1
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      orderId: options.orderId,
      commodityImg: options.commodityImg,
      pointName: options.pointName
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