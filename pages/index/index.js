//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showModal: false,
    newImage: "",
    images: [{src: "../../images/1.jpg"}, {src:"../../images/2.jpg"}, {src:"../../images/3.jpg"}]
  },
  //Handle scan tap
  bindViewTap: function() {
    var images = this.data.images
    wx.scanCode({
      success: (res) => {
        console.log(res)
        var url = res.result
        images.push({src: url})
        this.setData({
          images: images
        })
      }
    })
  },
  onImageLoaded: function (e) {
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;    //图片的真实宽高比例
    var viewWidth = 640,           //设置图片显示宽度，左右留有16rpx边距
      viewHeight = 640 / ratio;    //计算的高度值
    var images = this.data.images;
    //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
    var now = new Date()
    images[e.target.dataset.index] = {
      originalWidth: $width,
      originalHeight: $height,
      width: viewWidth,
      height: viewHeight,
      src: images[e.target.dataset.index].src,
      date: now.toLocaleDateString()
    }
    this.setData({
      images: images
    })
  },
  //Handle preview tap
  preview: function (e) {
    var index = e.target.dataset.index
    var urls = this.data.images.map(function (item) { return item.src })
    wx.previewImage({
      current: urls[index],
      urls: urls
    })
  },
  preventTouchMove: function () {
  },
  //Hide modal
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  //Cancel image save
  onCancel: function () {
    this.hideModal();
  },
  //Confirm image save
  onConfirm: function () {
    this.hideModal();
    var images = this.data.images
    images.push(this.data.newImage)
    this.setData({
      newImage: "",
      images: images
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
