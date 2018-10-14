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
    typez: '独栋',
    type: ['独栋', '联排', 'unit公寓', '土地', '农庄', '农场', '商业'],
    localz: '市中心',
    local: ['市中心', '中区双校网', '中区', '北岸', '北岸西湖校网', '北部郊区', '东区', '西区', '南区', '南部郊区', '其他地区'],
    posz: '',
    pos: ['全部'],
    methodz: '喊价',
    method: ['喊价', '议价', '拍卖', '投标'],
    zujin: '',
    huxing1: '0',
    huxing2: '0',
    huxing3: '0',
    huxing4: '0',
    tittz: '',
    subz: '',
    tempFilePaths: [],
    logs: [],
    tempFilePaths: '',
    filePaths: '',
    url: []
  },
  onLoad: function (params) {
    var that = this;
    if (params.id) {
      that.setData({
        id: params.id,
      })
      var id = params.id;
      var query = new AV.Query('BuyProperty');
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
    var i = this.data.local[e.detail.value];
    var middle = ['Arch Hill', 'Avondale', 'Blockhouse Bay', 'Balmoral', 'Eden Terrace', 'Eden Valley',
      'Ellerslie', 'Epsom', 'Freemans Bay', 'Glendowie', 'Glen Innes', 'Grafton', 'Greenlane', 'Greenwoods Corner',
      'Grey Lynn', 'Herne Bay', 'Hillsborough', 'Kingsland', 'Kohimarama', 'Lynfield', 'Meadowbank', 'Mission Bay',
      'Morningside', 'Mount Albert', 'Mount Eden', 'Mount Roskill', 'Mount Wellington', 'Newmarket', 'Newton', 'New Windsor',
      'Onehunga', 'One Tree Hill', 'Orakei', 'Oranga', 'Otahuhu', 'Owairaka', 'Panmure', 'Parnell', 'Penrose',
      'Point England', 'Point Chevalier', 'Ponsonby', 'Remuera', 'Royal Oak', 'Saint Heliers', 'Saint Johns', 'Saint Marys Bay',
      'Sandringham', 'Stonefields', 'Tamaki', 'Te Papapa', 'Three Kings', 'Waikowhai', 'Waterview', 'Western Springs',
      'Westfield', 'Westmere'];
    var middleSchool = ['Epsom', 'Greenlane', 'Mount Eden', 'New Market', 'Parnell', 'Remuera'];
    var north = ['Albany', 'Bayswater', 'Bayview', 'Beach Haven', 'Belmont', 'Birkdale', 'Birkenhead', 'Browns Bay',
      'Campbells Bay', 'Chatswood', 'Cheltenham', 'Crown Hill', 'Cuthill', 'Devonport', 'Fairview Heights', 'Forrest Hill',
      'Glenfield', 'Glenvar', 'Greenhithe', 'Hauraki', 'Highbury', 'Hillcrest', 'Long Bay', 'Mairangi Bay', 'Marlborough',
      'Meadowood', 'Milford', 'Murrays Bay', 'Narrow Neck', 'Northcote', 'Northcote Central', 'Northcote Point',
      'North Harbour', 'Northcross', 'Rosedale', 'Rothesay Bay', 'Okura', 'Oteha', 'Paremoremo', 'Pinehill', 'Schnapper Rock',
      'Stanley Bay', 'Stanley Point', 'Sunnynook', 'Takapuna', 'Torbay', 'Totara Vale', 'Unsworth Heights', 'Waiake',
      'Wairau Valley', 'Wesklake', 'Windsor Park'];
    var northSchool = ['Campbells Bay', 'Castor Bay', 'Forrest Hill', 'Glenfield', 'Hillcrest', 'Mairangi Bay', 'Milford',
      'Sunnynook', 'Takapuna', 'Wairau Valley'];
    var west = ['Glen Eden', 'Glendene', 'Green Bay', 'Henderson', 'Herald Island', 'Hobsonville', 'Huia', 'Kelston',
      'Konini', 'Laingholm', 'Lincoin', 'McLaren Park', 'Massey', 'New Lynn', 'Oratia', 'Ranui', 'Royal Heights', 'Sunnyvale',
      'Swanson', 'Te Atatu', 'Te Atatu Peninsula', 'Te Atatu South', 'Titirangi', 'Westgate', 'West Harbour', 'Western Heights',
      'Whenuapai'];
    var south = ['Airport Oaks', 'Brookby', 'Chapel Downs', 'Clendon Park', 'Clover Park', 'Favona', 'Goodwood Heights', 'Greenmeadows', 'Hill Park', 'Mahia Park', 'Mangere', 'Mangere Bridge', 'Mangere East', 'Manukau', 'Manukau Heights', 'Manurewa', 'Middlemore', 'Murphys Heights', 'North Park', 'Otara', 'Papatoetoe', 'Porchester Park', 'Puhinui',
      'Randwick Park', 'Redoubt Park', 'Richmond Park', 'Settlers Cove', 'Silkwood Heights', 'The Gardens', 'Totara Heights', 'Tuscany Estate', 'Waimahia Landing', 'Wattle Cove', 'Wattle Downs', 'Weymouth', 'Wiri'];
    var east = ['Beachlands', 'Botany Downs', 'Bucklands Beach', 'Clevedon', 'Cockle Bay', 'Dannemora', 'East Tamaki', 'Eastern Beach', 'Farm Cove', 'Flamboro Heights', 'Flat Bush', 'Golflands', 'Half Moon Bay', 'Heron Point', 'Highland Park', 'Howick', 'Maraetai', 'Meadowlands', 'Mellons Bay', 'Orere Point', 'Pakuranga', 'Shelly Park', 'Somerville', 'Sunnyhills', 'Whitford'];
    var northJQ = ['Dairy Flat', 'Gulf Harbour', 'Manly', 'Millwater', 'Orewa', 'Red Beach', 'Sandspit', 'Silverdale',
      'Silverdale', 'Stanmore Bay', 'Waimauku', 'Waiwera', 'Warkworth', 'Whangaparaoa', 'Wellsford'];
    var southJQ = ['Alfriston', 'Ardmore', 'Conifer Grove', 'Longford Park', 'Manurewa East', 'Pahurehure', 'Papakura',
      'Opaheke', 'Red Hill', 'Rosehill', 'Takanini'];

    console.log(e.detail.value)

    var tmp = ['全部'];

    if (e.detail.value == 1) {
      tmp = middleSchool;
    } else if (e.detail.value == 2) {
      tmp = middle;
    } else if (e.detail.value == 3) {
      tmp = north;
    } else if (e.detail.value == 4) {
      tmp = northSchool;
    } else if (e.detail.value == 5) {
      tmp = northJQ;
    } else if (e.detail.value == 6) {
      tmp = east;
    } else if (e.detail.value == 7) {
      tmp = west;
    } else if (e.detail.value == 8) {
      tmp = south;
    } else if (e.detail.value == 9) {
      tmp = southJQ;
    }

    this.setData({
      index2: e.detail.value,
      'localz': i,
      pos: tmp,
    })
  },
  postap: function (e) {
    var i = this.data.pos[e.detail.value]
    this.setData({
      index2: e.detail.value,
      'posz': i
    })
  },
  methodtap: function (e) {
    var i = this.data.method[e.detail.value]
    this.setData({
      index2: e.detail.value,
      'methodz': i
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
  huxingInput4: function (e) {
    this.setData({
      'huxing4': e.detail.value
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
    var query = new AV.Query('BuyProperty');
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
      av.set('huxing', that.data.huxing1 + "室" + that.data.huxing2 + "厅" + that.data.huxing3
        + "卫" + that.data.huxing4 + "车位");
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

    var property = AV.Object('BuyProperty');
    if (this.data.tittz == '') {
      property.set('titt', '无标题');
    } else {
      property.set('titt', this.data.tittz);
    }

    if (this.data.zujin == '') {
      property.set('zujin', this.data.methodz + "$" + 0 + "万");
      property.set('price', 0);
    } else {
      property.set('zujin', this.data.methodz + "$" + this.data.zujin + "万");
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
    property.set('huxing', this.data.huxing1 + "室" + this.data.huxing2 + "厅" + this.data.huxing3
      + "卫" + this.data.huxing4 + "车位");
    property.save().then(function (property) {
      var comment = AV.Object('BuyComment');
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
