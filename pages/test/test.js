const app = getApp();
let that;
let CodeUrlbg = '/assets/img/coupon.jpg'; //背景图片
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img: "/assets/img/coupon.jpg",
    wechat: "/assets/img/cat.png",
    xiazai: "/assets/img/cat.png",
    share: "/assets/img/shop-bag.png",
    maskHidden: false,
    imgList: [{
      src: '/assets/img/coupon.jpg'
    }, {
      src: '/assets/img/1.jpg',
      value: '哈哈哈哈哈哈'
    }],
    avatarPath: '/assets/img/1.jpg',
    helpBuyBegin: {
      userName: '烟酒情话',
      commodityName: '【好友拼单】，一起来抢芝士味的香喷喷的烤肠哇！！！！！！',
    },
    shopImagePath: '/assets/img/hd.png',
    ewmImg: '/assets/img/qrCode.png'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.getSystemInfo({
      success: function (res) {
        // 获取可使用窗口宽度
        let clientWidth = res.windowWidth;
        // 获取可使用窗口高度
        let clientHeight = res.windowHeight;
        // 算出比例
        let ratio = 750 / clientWidth;
        // 算出高度(单位rpx)
        let height = clientHeight * ratio;
        // 设置高度
        that.setData({
          clientWidth,
          clientHeight
        });
      }
    });
  },

  createNewImg: function () {
    wx.createSelectorQuery()
      .select('#myCanvas')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        // Canvas 对象
        const canvas = res[0].node
        // 渲染上下文
        const ctx = canvas.getContext('2d')
        // Canvas 画布的实际绘制宽高
        const width = res[0].width
        const height = res[0].height
        // 初始化画布大小
        const dpr = wx.getWindowInfo().pixelRatio
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)
        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = "#fff"
        ctx.fillRect(0, 0, that.data.clientWidth, that.data.clientHeight)
        that.saveCanvers(canvas, ctx);
      })

  },
  async saveCanvers(canvas, ctx) {
    const {
      helpBuyBegin,
      shopImagePath,
      avatarPath,
      imgList,
      ewmImg
    } = that.data
    const width = wx.getSystemInfoSync().screenWidth // 获取设备宽度
    // 背景色
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 375, 589)
    // 背景图
    await that.downLoadDrow(canvas, ctx, imgList[0].src, 0, 0, wx.getSystemInfoSync().windowWidth, 600)
    //头像二维码 开始
    var a_avatarurl_width = 52; //绘制的头像宽度
    var a_avatarurl_heigth = 52; //绘制的头像高度
    var a_avatarurl_x = (width / 2) - (a_avatarurl_width / 2); //绘制的头像在画布上的位置
    var a_avatarurl_y = 60; //绘制的头像在画布上的位置
    ctx.save();
    ctx.beginPath(); //开始绘制
    //先画个圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
    // ctx.arc(a_avatarurl_width / 2 + a_avatarurl_x, a_avatarurl_width / 2 + a_avatarurl_y, a_avatarurl_width / 1.99, 0, Math.PI * 2, false);
    //画好了圆 剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内 这也是我们要save上下文的原因  
    ctx.fill()
    ctx.clip();
    // let base64Png = wx.getFileSystemManager().readFileSync(qrcodeData.path, 'base64');
    // let qrcodeData_base64 = 'data:image/jpg;base64,' + base64Png
    //ctx.drawImage(avatarPath, a_avatarurl_x, a_avatarurl_y, a_avatarurl_width, a_avatarurl_heigth);
    // await that.downLoadDrow(canvas, ctx, avatarPath, a_avatarurl_x, a_avatarurl_y, a_avatarurl_width, a_avatarurl_heigth)
    // //恢复之前保存的绘图上下文 恢复之前保存的绘图上下文即状态 还可以继续绘制  
    ctx.restore();
    //头像二维码 结束

    //内容背景
    // console.log('内容宽度', imgList[1].src.width)
    // const contentImage = (width / 2) - (imgList[1].value.width / 4)
    // console.log(contentImage)
    // await that.downLoadDrow(canvas, ctx, imgList[1].src, 25, 125, 345, 212.5)
    // // ctx.stroke();
    // //商品图片
    // await that.downLoadDrow(canvas, ctx, shopImagePath, 32, 220, 100, 100)
    // ctx.save();
    // ctx.beginPath(); //开始绘制
    // ctx.moveTo(100, 130); //将画笔移动到坐标 100 130
    // ctx.lineTo(300, 130); 
    // ctx.lineTo(300, 240); 
    // ctx.lineTo(100, 240);

    // ctx.closePath(); //闭合线条
    // ctx.lineWidth = 1; //线宽
    // ctx.strokeStyle = '#fff'; //描边颜色
    // ctx.stroke(); //渲染直线(描边)
    // ctx.fillStyle = '#ffffff'
    // ctx.fill();
    // ctx.clip();
    let nickName = helpBuyBegin.userName
    if (nickName.length > 12) {
      nickName = nickName.substring(0, 10) + '...'
    }
    ctx.font = 'normal bold 12px sans-serif'
    ctx.textAlign = 'left';
    ctx.fillStyle = '#000'
    // ctx.fillText(nickName, (width - ctx.measureText(nickName).width) * 0.5, 122);

    let explain = '我参与了xxxxx活动，您xxxxx助力可帮我xxxxxx，快来助我一臂之力吧！'
    ctx.font = 'normal bold 13px sans-serif'
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fff'
    // await that.fillTextWrap(ctx, explain, 35, 180, 300, 20);

    let str = helpBuyBegin.commodityName.substring(0, 30);
    if (str.length * 2 <= 40) {
      str = helpBuyBegin.commodityName.substring(0, 30)
    } else {
      str = helpBuyBegin.commodityName.substring(0, 28) + '...';
    }
    ctx.font = 'normal 12px sans-serif'
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fff'
    // await that.fillTextWrap(ctx, str, 150, 235, 160, 20);

    ctx.font = 'normal 10px sans-serif'
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fff'
    // ctx.fillText('xxxx市场价: ¥ ' + helpBuyBegin.linePrice, 150, 298);

    ctx.font = 'normal bold 10px sans-serif'
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fff'
    // ctx.fillText('xxxx最低价:', 150, 315);

    ctx.font = 'normal 10px sans-serif'
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fff'
    // ctx.fillText('¥', 215, 315);

    ctx.font = 'normal bold 18px sans-serif'
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fff'
    // ctx.fillText(helpBuyBegin.price, 223, 315);

    //商品二维码 开始
    var e_avatarurl_width = 100; //绘制的头像宽度
    var e_avatarurl_heigth = 100; //绘制的头像高度
    var e_avatarurl_x = (width - width * 0.2) / 2.15; //绘制的头像在画布上的位置
    var e_avatarurl_y = 370; //绘制的头像在画布上的位置
    ctx.save();
    ctx.beginPath(); //开始绘制
    //先画个圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
    ctx.arc(e_avatarurl_width / 2 + e_avatarurl_x, e_avatarurl_width / 2 + e_avatarurl_y, e_avatarurl_width / 1.9, 0, Math.PI * 2, false);
    //画好了圆 剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内 这也是我们要save上下文的原因  
    // ctx.setFillStyle('#ffffff');
    ctx.fillStyle = '#ffffff'
    ctx.fill();
    ctx.clip();
    //ctx.drawImage(qrcodeData.path, e_avatarurl_x, e_avatarurl_y, e_avatarurl_width, e_avatarurl_heigth);
    await that.downLoadDrow(canvas, ctx, ewmImg, e_avatarurl_x, e_avatarurl_y, e_avatarurl_width, e_avatarurl_heigth)
    //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 还可以继续绘制  
    ctx.restore();
    //商品二维码 结束        

    const tips = '长按两秒识别二维码';
    ctx.font = 'normal 10px sans-serif'
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff'
    //3表示宽度,4表示高度
    ctx.fillText(tips, (width - ctx.measureText(tips).width) * 0.5, 495); // 绘制文字(文字居中)

    const tips2 = '领取更多优惠券吧';
    ctx.font = 'normal 10px sans-serif'
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff'
    //3表示宽度,4表示高度
    ctx.fillText(tips2, (width - ctx.measureText(tips2).width) * 0.5, 511); // 绘制文字(文字居中)

    wx.canvasToTempFilePath({
      // x: 0, //指定的画布区域的左上角横坐标    
      // y: 0, //指定的画布区域的左上角纵坐标    
      // width: 375, //指定的画布区域的宽度
      // height: 589, //指定的画布区域的高度
      // destWidth: 375*dpr, //输出的图片的宽度 
      // destHeight: 589*dpr, //输出的图片的高度 
      canvas: canvas,
      fileType: 'jpg', //图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。
      success(res) {
        // 获得图片临时路径
        console.log(res, '8520');
        wx.hideLoading({
          fial: (err) => {}
        })
        that.setData({
          imageTempPath: res.tempFilePath
        });
        // that.saveImg(res.tempFilePath)

      }
    })
  },
  // 绘制图片
  downLoadDrow(canvas, ctx, url, x, y, w, h) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: url,
        success: (res) => {
          const img = canvas.createImage();
          img.src = '/'+res.path; //微信请求返回头像
          img.onload = () => {
            ctx.drawImage(img, x, y, w, h);
            img.src = ""
            resolve()
          }
        },
        fail: (err) => {
          console.log('err',err)
          wx.showToast({
            title: '下载图片失败，请稍后重试',
            icon: 'none'
          })
          reject()
          return false
        }
      })
    })
  },

  //绘制文字
  fillTextWrap(ctx, str, x, y, w, h) {
    ctx.font = "14px Verdana";
    ctx.fillText(str, x, y, w, h); //    ctx.fillText(文字, 移动x, 移动y) 
  },





  //点击保存到相册
  baocun: function () {
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imageTempPath,
      success: (res) => {
        wx.showToast({
          title: '已保存到相册',
          icon: 'success',
          duration: 2000
        })
      },
      fail: (err) => {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        });
      }
    })
  },

  //点击生成
  formSubmit: function (e) {
    this.setData({
      maskHidden: false
    });
    wx.showToast({
      title: '海报生成中...',
      icon: 'loading',
      duration: 1000
    });
    setTimeout(function () {
      wx.hideToast()
      that.setData({
        maskHidden: true
      });
      that.createNewImg();
    }, 1000)
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
    wx.getUserProfile({
      success: res => {
        console.log(res, "huoqudao le ")
        this.setData({})
      }
    })
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
  onShareAppMessage: function (res) {
    return {
      title: "一起来学习小程序吧~",
      success: function (res) {
        console.log(res, "转发成功")
      },
      fail: function (res) {
        console.log(res, "转发失败")
      }
    }
  }
})