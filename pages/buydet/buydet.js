//index.js
//获取应用实例
const app = getApp()
const AV = require('../../utils/av-weapp.js')

Page({
  data: {
    id: '',
    good: [],
    photos: [],
    imgUrls: [
      '../../assets/images/banner_02.png',
      '../../assets/images/banner_02.png',
      '../../assets/images/banner_02.png',
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    like:'收藏',
    liked:false,
    tx: '../../assets/images/img1_10.png',
    name:'小猪不会飞',
    titt:'哥谭市 市中心',
    house: 'Mt Albert  4室2厅3卫3车位',
    price:'3500/周',
    det:[
      {
        point:'卧室',
        info:'12.7㎡，南，家具齐全'
      },
      {
        point: '公共卫生间',
        info: '7.5㎡，未知，配有洗衣机、热水器'
      },
      {
        point: '起居室',
        info: '47.5㎡，未知，配有智能锁、路由器'
      },
    ],
    tui:[
      {
        tu:'../../assets/images/uu_03.png',
        price:'$3500/晚',
        titt:'M景区整套租2室可住6人2个车位走路上Unitec 5分钟上高速'
      },
      {
        tu: '../../assets/images/uu_03.png',
        price: '$3500/晚',
        titt: 'M景区整套租2室可住6人2个车位走路上Unitec 5分钟上高速'
      },
      {
        tu: '../../assets/images/uu_03.png',
        price: '$3500/晚',
        titt: 'M景区整套租2室可住6人2个车位走路上Unitec 5分钟上高速'
      },
      {
        tu: '../../assets/images/uu_03.png',
        price: '$3500/晚',
        titt: 'M景区整套租2室可住6人2个车位走路上Unitec 5分钟上高速'
      },
      {
        tu: '../../assets/images/uu_03.png',
        price: '$3500/晚',
        titt: 'M景区整套租2室可住6人2个车位走路上Unitec 5分钟上高速'
      },
      {
        tu: '../../assets/images/uu_03.png',
        price: '$3500/晚',
        titt: 'M景区整套租2室可住6人2个车位走路上Unitec 5分钟上高速'
      },
      {
        tu: '../../assets/images/uu_03.png',
        price: '$3500/晚',
        titt: 'M景区整套租2室可住6人2个车位走路上Unitec 5分钟上高速'
      },
      {
        tu: '../../assets/images/uu_03.png',
        price: '$3500/晚',
        titt: 'M景区整套租2室可住6人2个车位走路上Unitec 5分钟上高速'
      },
    ],

  },
  logIn: function () {
    var that = this;
    AV.User.loginWithWeapp().then(user => {
      app.globalData.user = user.toJSON();
    }).catch(console.error);

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
        fail: function () {
          wx.showModal({
            title: '用户未授权',
            content: '您点击了拒绝授权，将无法正常使用发布消息以及我的关注的功能体验。可通过点击确定，在设置中重新授权用户权限。',
            showCancel: true,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.openSetting({
                  success: function success(res) {
                    wx.getUserInfo({
                      success: res => {
                        app.globalData.userInfo = res.userInfo
                        that.setData({
                          userInfo: res.userInfo,
                          hasUserInfo: true
                        })
                      },
                    });
                  }
                });
              }
            },
            fail: function (res) {
            }
          })
        }
      })
    }
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '奇异租房',
      desc: that.data.good.titt,
      path: '/pages/buydet/buydet?id=' + that.data.id,
    }
  },
  like: function (){
    var that = this
    var id = that.data.id;
    console.log(id);
    var query = new AV.Query('BuyProperty');
    query.equalTo('objectId', id);

    if(this.data.liked){
      this.setData({
        'like': '收藏',
        'liked': false
      });

      var userQ = new AV.Query('_User');
      userQ.equalTo('authData', AV.User.current().attributes.authData);
      userQ.find().then(function (goodsObject) {
        var av = goodsObject[0];
        av.remove('likeBuys', id);
        av.save().then(function (av) {
        }, function (error) {
          // 异常处理
          console.error(error);
        });
      }).catch(console.error);

      query.find().then(function (goodsObject) {
        var urls = null;
        that.setData({
          good: goodsObject[0]
        });
        var av = goodsObject[0];
        console.log(av);
        av.increment("like", -1);
        av.save().then(function (av) {
        })
      });
    }else{
      this.setData({
        'like': '已收藏',
        'liked': true
      });
      
      var userQ = new AV.Query('_User')
      userQ.equalTo('authData', AV.User.current().attributes.authData);
      userQ.find().then(function (goodsObject){
        var av = goodsObject[0];
        av.add('likeBuys', id);
        av.save().then(function (av) {
          console.log(av.id);
        }, function (error) {
          // 异常处理
          console.error(error);
        });
      }).catch(console.error);
      
      query.find().then(function (goodsObject) {
        var urls = null;
        that.setData({
          good: goodsObject[0]
        });
        var av = goodsObject[0];
        console.log(av);
        av.increment("like", 1);
        av.save().then(function (av) {
        })
      });
    }
    
  },
  da: function () {
    var that = this;
    console.log("跳到question页面")
    wx.navigateTo({
      url: '../question/question?id=' + that.data.id + '&source=buy'
    })
  },
  onLoad: function (params) {
    this.logIn();
    var that = this
    that.setData({
      id: params.id
    });
    var id = params.id;
    console.log(id);

    var likesQuery = new AV.Query('_User');
    likesQuery.equalTo('authData', AV.User.current().attributes.authData);
    likesQuery.find().then(function (goodsObject) {
      var data = goodsObject[0];
      var likes = data.attributes.likeBuys;
      if (likes.indexOf(id) == -1) {
      } else {
        that.setData({
          'like': '已收藏',
          'liked': true
        });
      }
    })

    var query = new AV.Query('BuyProperty');
    query.equalTo('objectId', id);
    query.find().then(function (goodsObject) {
      var urls = null;
      that.setData({
        good: goodsObject[0]
      });

      var av = goodsObject[0];
      av.increment("view", 1);
      av.save().then(function (av) {
        
      })
    });
  },
  preview: function (e) {
    console.log(e)
    var that = this;
    var tmp = [];
    tmp = that.data.good.attributes.photo;
    var tmpImage = tmp[e.target.id];
    wx.previewImage({
      current: tmpImage,
      urls: tmp,
    });
  }
})
