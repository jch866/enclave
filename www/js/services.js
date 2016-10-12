angular.module('starter.services', [])

.service('getArticleList', function($http, BaseService) {
    var articles = [];
    this.all = function() {
        $http.get(urls.getArticles).success(function(data) {
              console.log(data);
            var length = data.result.length;
            for (var i = 0; i < 10; i++) {
                articles[i] = data.result[i];
            }
        }).error(function(err) {
            console.log(err);
        });
        return articles;
    };
    this.remove = function(id) {
        articles.splice(articles.indexOf(id), 1);
    };
    this.get = function(artId) {
        for (var i = 0; i < articles.length; i++) {
            if (articles[i].art_id === parseInt(artId)) {
                return articles[i];
            }
        }
        return null;
    };
    this.doRefresh = function() {
        BaseService.doRefresh();
    };
    var webData = {
        "status": 0,
        "message": "返回成功",
        "article": [{
            "art_id": 12,
            "art_title": "11",
            "art_tag": "11",
            "art_description": "11",
            "art_thumb": "uploads\/20160612111414200.jpg",
            "art_sound": null,
            "art_movie": null,
            "art_content": "11 < \/p>",
            "art_time": "1465285624",
            "art_editor": "11",
            "art_view": "0",
            "cate_id": "1"
        },{
            "art_id": 12,
            "art_title": "11",
            "art_tag": "11",
            "art_description": "11",
            "art_thumb": "uploads\/20160612111414200.jpg",
            "art_sound": null,
            "art_movie": null,
            "art_content": "11 < \/p>",
            "art_time": "1465285624",
            "art_editor": "11",
            "art_view": "0",
            "cate_id": "1"
        },{
            "art_id": 12,
            "art_title": "11",
            "art_tag": "11",
            "art_description": "11",
            "art_thumb": "uploads\/20160612111414200.jpg",
            "art_sound": null,
            "art_movie": null,
            "art_content": "11 < \/p>",
            "art_time": "1465285624",
            "art_editor": "11",
            "art_view": "0",
            "cate_id": "1"
        }]
    };
    //测试用
    this.data= webData.article;
})
.service('BaseService', function($http) {
    this.loadMore = function($this) {
        console.log("正在加载更多数据..." + $this.page);
        $http.get($this.url + "?page=" + $this.page + "&rows=" + settings.rows).success(function(response) {
            console.log(response);
            if (response.articles.length > 0) {
                $this.items = $this.items.concat(response.articles);
                $this.page++;
            } else {
                console.log("没有数据了...")
                $this.isload = true;
            }
            $this.callback();
        });
    }

    this.doRefresh = function($this) {  //todo
        console.log("正在执行refresh操作...");
        var url = server.domain + "?callback=JSON_CALLBACK";
        //使用jsonp的方式请求
        $http.get(url).success(function(response) {
            console.log(response);
            $this.page = 2;
            $this.items = response.article;
            $this.callback();
            $this.isload = false;
        });
    }
})
.service('AccountService', function($http,$ionicPopup) {
    var $this = this;
    // 获取缓存用户信息
    this.getCacheUser = function() {
            return angular.fromJson(window.localStorage[cache.user]);
        }
    // 获取用户信息
    this.getUserInfo = function(id) {
            var url = urls.getUserInfo;
            var data = {
                user_id: id
            }
            $http.post(url, data).success(function(resp) {
                console.log(resp);
                if (resp.code == 200) {
                    window.localStorage[cache.user] = JSON.stringify(resp.result);
                } else {
                    $ionicPopup.alert({
                        title: '提示',
                        template: resp.message || '返回个人信息失败'
                    })
                }
            }).error(function(error) {
                console.log("error");
            })
        }
        //发送手机号和验证码登录
    this.login = function(phone, code) {
            var url = urls.login + "identifier=" + phone + "&credential=" + code;
            return $http.post(url);
        }
        //设置用户信息
    this.uploadUser = function(token, id, obj) {
            // var url = urls.setUserInfo + "?token=" + token + "&user_id=" + id + "&avatar=" + obj.avatar + "&nickname=" + obj.name + "&sex=" + obj.sex + "&birthday=" + obj.birthday;
            var url = urls.setUserInfo;
            var data = {
                    user_id: id,
                    avatar: obj.avatar,
                    nickname: obj.name,
                    sex: obj.sex,
                    birthday: obj.birthday
                }
                // return $http.post(url,data,headers);
            return $http.post(url, data);
            // var req={
            //  method:'POST',
            //  url:'',
            //  headers:{},
            //  data:{}
            // };
            // $http(req).then(function(){},function(){})
        }

        // 注册
    this.reg = function(phone) {
        var url = urls.sendCode + phone;
        return $http.post(url);
    }
})

.service('ArticleService', function($http) {
     this.getDetails = function (id) {
      var url = urls.getArticleDetail + id;
      return $http.get(url);
    }
})
.service('FavService', function($http) {

    var token=wsCache.get("userToken");
    //获取收藏列表
    this.getFav = function (page) {
      var url = urls.fav + "&page=" + page + "&rows" + settings.rows + "&token=" + token;
      return $http.post(url);
    }
    //删除收藏
    this.delFav = function (id, type,token) {
      var url = urls.favAddDel + "&id=" + id + "&type=" + type + "&token=" + token
      return $http.post(url);
    }
    //添加收藏
    this.addFav = function (id, type, title,token) {
      var url = urls.favAddDel + "&id=" + id + "&type=" + type + "&title=" + title + "&token=" + token
      return $http.post(url);
    }
})
.service('ComService', function($http) {
    //回复评论
    this.pubCom = function(id, type, source_id, content, pid) {
        var url = urls.pubComment;
        var data = {
            user_id: id, //用户id
            type: type, //回复的是文章还是其它类型
            source_id: source_id, //文章的id
            content: content, //回复内容
            pid: pid //判断是不是回复的评论
        };
        console.log(data);
        return $http.post(url, data);
    };
    //获取单篇文章评论列表
    this.getSingleCom = function(type, source_id, page, count) {
        var url = urls.getComment+"?source_id=" + source_id + "&type=" + type + "&page=" + page + "&count=" + count;
        return $http.get(url);
        // var data = {
        //     type:type,// 评论的类型
        //     source_id:source_id,//文章ID
        //     page:page,  //默认第一页
        //     count:count  //每页数量，默认10条
        // };
        // console.log(data);
       
        //return $http.get(url, data);
    };

    //删除评论
    this.delCom = function() {

    };
   
    //查看评论
    this.delCom = function() {

    };

    //登录后查看个人评论
    this.myComList = function(user_id,page,count) {
        var url = urls.getMessage+"?user_id=" + user_id+"&page=" + page + "&count=" + count;
        return $http.get(url);
    };
})

.factory('httpInterceptor',function () {  //拦截器
            return {
                request:function(config){//请求发出去之前
                    if(window.localStorage[cache.token]){
                       config.headers.Authorization = 'Bearer '+window.localStorage[cache.token];
                    }else{
                        //$http.defaults.headers.common.Authorization = '';
                        config.headers.Authorization = '';
                    }
                    return config;
                }
               /* 'response':function(response){//服务器响应时
                    return response;
                },
                'requestError':function(rejection){//请求失败
                    var rootScope=$injector.get('$rootScope');//可以通过$injector来获取注入angular的服务，如$rootScope、$state等等

                    return $q.reject(rejection);
                },
                'responseError':function(rejection){//响应失败
                   // var rootScope=$injector.get('$rootScope');
                    //var state=$injector.get('$state');
                    if(rejection.status==404){//一些错误处理

                    }else if(rejection.status==401){

                    }else{

                    }
                    return rejection;
                }*/
            };
        })


 