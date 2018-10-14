//index.js
//获取应用实例
const app = getApp()
const AV = require('../../utils/av-weapp.js'); 

Page({
  data: {
    upflag: true,
    id: '',
    update: false,
    imgflag: true,
    index1: 0,
    index2: 0,
    typez: '单间',
    type: ['单间', '整套'],
    localz: '奥克兰',
    local: ['奥克兰', 'Rotorua', 'Taupo', '奥克兰岛屿', '北岛其他城市', '南岛'],
    posz: '市中心',
    pos: ['市中心', '景区', '其他景点'],
    zujin: '',
    huxing1: '0',
    huxing2: '0',
    huxing3: '0',
    tittz: '',
    subz: '',
    tempFilePaths: [],
    logs: [],
    tempFilePaths: '',
    filePaths: '',
    url: [],
  },
  onLoad: function (params) {
    var that = this;
    if (params.id) {
      that.setData({
        id: params.id,
      })
      var id = params.id;
      var query = new AV.Query('DuanProperty');
      query.equalTo('objectId', id);
      query.find().then(function (goodsObject) {
        console.log(goodsObject[0]);
        var flag = true;
        if (goodsObject[0].attributes.photo.length == 9) {
          flag = false;
        }
        that.setData({
          imgflag: flag,
          typez: goodsObject[0].attributes.type,
          localz: goodsObject[0].attributes.location,
          zujin: goodsObject[0].attributes.price,
          tittz: goodsObject[0].attributes.titt,
          subz: goodsObject[0].attributes.subtitt,
          url: goodsObject[0].attributes.photo,
          posz: goodsObject[0].attributes.region,
          update: true
        })
      })
    }
  },
  typetap: function (e) {
    var i = this.data.type[e.detail.value]
    this.setData({
      index1: e.detail.value,
      'typez':i
    })
  },
  localtap: function (e) {
    var i = this.data.local[e.detail.value]
    this.setData({
      index2: e.detail.value,
      'localz': i
    })
  },
  postap: function (e) {
    var i = this.data.pos[e.detail.value]
    this.setData({
      index2: e.detail.value,
      'posz': i
    })
  },
  zujinInput: function (e) {
    this.setData({
      'zujin': e.detail.value
    })
  },
  huxingInput1: function (e) {
    this.setData({
      'huxing1': e.detail.value
    })
  },
  huxingInput2: function (e) {
    this.setData({
      'huxing2': e.detail.value
    })
  },
  huxingInput3: function (e) {
    this.setData({
      'huxing3': e.detail.value
    })
  },
  titleInput: function (e) {
    this.setData({
      'tittz': e.detail.value
    })
  },
  desInput: function (e) {
    this.setData({
      'subz': e.detail.value
    })
  },
  upimg: function () {
    var _this = this;
    var fileUrl = null;
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        _this.setData({
          tempFilePaths: res.tempFilePaths
        })
        wx.showToast({
          title: '上传中……',
          icon: 'loading',
          duration: 5000,
          mask: true
        })
        for (var c = 0; c < res.tempFilePaths.length; c++) {
          var tempFilePath = res.tempFilePaths[c];
          new AV.File('file-name', {
            blob: {
              uri: tempFilePath,
            },
          }).save().then(function (av) {
            var tmpUrl = av.attributes.url;
            var tmpArr = _this.data.url;
            tmpArr[_this.data.url.length] = tmpUrl;
            var flag = true;
            if (tmpArr.length >= 9) {
              flag = false;
            }
            _this.setData({
              url: tmpArr,
              imgflag: flag
            })
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000,
              mask: true
            })
          }
            ).catch(console.error);

        }
      },
    })
  },  
  up: function (e) {
    wx.showToast({
      title: '发布中……',
      icon: 'loading',
      duration: 5000,
      mask: true
    })
    this.setData({
      upflag: false,
    })
    var that = this;
    if (that.data.update) {
      that.update(e);
    } else {
      that.upload(e);
    }
  },
  update: function (e) {
    var that = this;
    var query = new AV.Query('DuanProperty');
    query.equalTo('objectId', that.data.id);
    query.find().then(function (goodsObject) {
      that.setData({
        update: false,
      });

      var av = goodsObject[0];
      av.set('type', that.data.typez);
      av.set('location', that.data.localz);
      av.set('price', that.data.zujin);
      av.set('subtitt', that.data.subz);
      av.set('photo', that.data.url);
      av.set('huxing', that.data.huxing1 + "室 可住" + that.data.huxing2 + "人" + that.data.huxing3
        + "车位");
      av.save().then(function (av) {
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 1000,
          mask: true
        })
        that.setData({
          upflag: true,
        })
        wx.navigateBack({ changed: true });
      }).catch(console.error);
    });
  },
  upload: function (e) {
    var that = this;
    var nickName = '';
    var avatar = null;
    if (app.globalData.userInfo) {
      nickName = app.globalData.userInfo.nickName;
      avatar = app.globalData.userInfo.avatarUrl;
    }

    var property = AV.Object('DuanProperty');
    if (this.data.tittz == '') {
      property.set('titt', '无标题');
    } else {
      property.set('titt', this.data.tittz);
    }

    if (this.data.zujin == '') {
      property.set('zujin', "$" + 0 + "/day");
      property.set('price', 0);
    } else {
      property.set('zujin', "$" + this.data.zujin + "/day");
      property.set('price', parseInt(this.data.zujin));
    }

    var now = new Date();
    var day = now.getDay();
    var date = now.getDate();
    var month = now.getMonth();

    if (day == 1) {
      day = 'Mon'
    } else if (day == 2) {
      day = 'Tue'
    } else if (day == 3) {
      day = 'Wed'
    } else if (day == 4) {
      day = 'Thu'
    } else if (day == 5) {
      day = 'Fri'
    } else if (day == 6) {
      day = 'Sat'
    } else if (day == 0) {
      day = 'Sun'
    }

    if (month == 0) {
      month = 'Jan'
    } else if (month == 1) {
      month = 'Feb'
    } else if (month == 2) {
      month = 'Mar'
    } else if (month == 3) {
      month = 'Apr'
    } else if (month == 4) {
      month = 'May'
    } else if (month == 5) {
      month = 'Jun'
    } else if (month == 6) {
      month = 'Jul'
    } else if (month == 7) {
      month = 'Aug'
    } else if (month == 8) {
      month = 'Sep'
    } else if (month == 9) {
      month = 'Oct'
    } else if (month == 10) {
      month = 'Nov'
    } else if (month == 11) {
      month = 'Dec'
    }

    property.set('view', 0);
    property.set('comment', 0);
    property.set('like', 0);
    property.set('unres', 0);
    property.set('time', day + ' ' + date + ' ' + month);
    property.set('subtitt', this.data.subz);
    property.set('owner', AV.User.current().attributes.authData.lc_weapp.openid);
    property.set('photo', this.data.url);
    property.set('location', this.data.localz);
    property.set('region', this.data.posz);
    property.set('moveInTime', '2018-01-17');
    property.set('contactDetail', '02102820178');
    property.set('type', this.data.typez);
    property.set('tx', avatar);
    property.set('name', nickName);
    property.set('huxing', this.data.huxing1 + "室 可住" + this.data.huxing2 + "人" + this.data.huxing3
      + "车位");
    property.save().then(function (property) {
      var comment = AV.Object('DuanComment');
      comment.set('number', 0);
      comment.set('unres', 0);
      comment.set('propertyId', property.id);
      comment.set('details', []);
      comment.save().then(function (comment) {
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 1000,
          mask: true
        })
        that.setData({
          upflag: true,
        })
      }).catch(console.error);
      wx.navigateBack({ changed: true });
    }).catch(console.error);
  },
  // 关闭当前选择的这个图片
  closeUploadImg: function (res) {
    var e = res.currentTarget.dataset.index
    this.data.url.splice(e, 1);
    var flag = false;
    if (this.data.url.length < 10) {
      flag = true;
    }
    this.setData({
      url: this.data.url,
      imgflag: flag
    });
  },
})
