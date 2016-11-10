angular.module('starter.services', [])

.service('getArticleList', function($http, BaseService) {
        this.getArticles = function(userId, page, count) {
            var urlStr = urls.getArticles;
            var url = userId ? urlStr + "?page=" + page + "&count=" + count + "&user_id=" + userId : urlStr + "?page=" + page + "&count=" + count;
            return $http.get(url);
        };

        this.doRefresh = function() {
            BaseService.doRefresh();
        };
    })
.service('BaseService', function($http) {
        this.loadMore = function($this) {
            console.log("正在加载更多数据..." + $this.page);
            $http.get($this.urlApi + "?page=" + $this.page + "&rows=" + settings.rows).then(function(response) {
                console.log(response);
                var newData = response.data.result.data;
                if (newData > 0) {
                    $this.items = $this.items.concat(newData);
                    $this.page++;
                } else {
                    console.log("没有数据了...")
                    $this.isload = true;
                }
            },function(err){
                console.log("loadMore error");
            }).finally(function(){
                 $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }

        this.doRefresh = function($this) { //todo
            console.log("正在执行refresh操作...");
            $http.get($this.urlApi).then(function(response) {
                console.log(response);
                $this.page = 2;
                $this.items = response.article;
                $this.isload = false;
            },function(error){
                console.log("doRefresh error");
            }).finally(function(){
            $scope.$broadcast('scroll.refreshComplete');
            });
        }
    })
// .service('categoryDate', function($http, BaseService) {
//     this.getCate = function() {
//         var categoryDate = [{
//             title: "推荐",
//             page: 1,
//             count: 10,
//             type: "article",
//             isload: true,
//             items:[],
//             urlApi: urls.getArticles,
//             loadMore: function() {
//                 BaseService.loadMore(this);
//             },
//             doRefresh: function() {
//                 BaseService.doRefresh(this);
//             }
//         }, {
//             title: "专题",
//             //page: 1,
//             //count: 5,
//             // items:[],
//             type: "article",
//             isload: true,
//             urlApi: urls.getCategory + "?have_data=0",
//             loadMore: function($this) {
//                 console.log("正在加载更多数据..." + $this.page);
//                 $http.get($this.urlApi).then(function(response) {
//                     console.log(response);
//                     var newData = response.data.result.categories.data;
//                     if (newData > 0) {
//                         $this.items = $this.items.concat(newData);
//                         $this.page++;
//                     } else {
//                         console.log("没有数据了...")
//                         $this.isload = true;
//                     }
//                 }, function(err) {
//                     console.log("loadMore error");
//                 }).finally(function() {
//                     $scope.$broadcast('scroll.infiniteScrollComplete');
//                 });
//             },
//             doRefresh: function($this) {
//                 console.log("正在执行refresh操作...");
//                 $http.get($this.urlApi).then(function(response) {
//                     console.log(response);
//                     $this.items = response.data.result.categories.data; 
//                 }, function(error) {
//                     console.log("doRefresh error");
//                 }).finally(function() {
//                     $scope.$broadcast('scroll.refreshComplete');
//                 });
//             }
//         }];
//         return categoryDate;
//     }
// })



.service('AccountService', function($http, $ionicPopup, $rootScope, $state, $timeout, $ionicLoading) {
    var $this = this;
    // 跳转前判断登录状态
    this.goState = function(route, data) {
            if (window.localStorage[cache.logined] === "true") {
                data ? $state.go(route, { data: data }) : $state.go(route);
            } else {
                $ionicLoading.show({
                    template: "请登录!",
                    noBackdrop: true
                })
                $timeout(function() {
                    $ionicLoading.hide();
                }, 1000)
            }
        }
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
                    $rootScope.user = $this.getCacheUser();
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
            var url = urls.login;
            var data = {
                type: "mobile",
                identifier: phone,
                credential: code
            }
            return $http.post(url, data);
        }
        //设置用户信息
    this.uploadUser = function(obj, id) { //id为注册短信返回的ID
        var url = urls.setUserInfo;
        var data = {
            id: id,
            type: "mobile",
            avatar: obj.avatar,
            nickname: obj.name,
            sex: obj.sex,
            birthday: obj.birthday
        }
        console.log(data + "设置用户信息");
        return $http.post(url, data);
    }

    // 注册
    this.reg = function(phone) {
        var url = urls.sendCode + phone;
        return $http.post(url);
    }
})

.service('ArticleService', function($http) {
        this.getDetails = function(id, userId) {
            var url = urls.getArticleDetail;
            url += userId ? (id + "&user_id=" + userId) : id;
            return $http.get(url);

        }
    })
.service('cateService', function($http) {
    this.getCateList = function(have_data,cate_id){
        var url = urls.getCategory + "?have_data="+have_data+"&cate_id="+cate_id;
        return $http.get(url);
    }
      
})
    .service('FavService', function($http) {

        //获取收藏列表
        this.getFavList = function(user_id, page, count) {
                var url = urls.favList + "?user_id=" + user_id; //+"&page=" + page + "&count=" + count 
                return $http.get(url);
            }
            //删除收藏
        this.addDelFav = function(user_id, article_id) {
            var url = urls.favAddDel;
            var data = {
                user_id: user_id,
                article_id: article_id
            };
            return $http.post(url, data);
        }
    })
    .service('ComService', function($http, httpService, $ionicHistory) {
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
            // httpService.httpPost(url, data).then(function(resp) {
            //      if (resp.code == 200) {
            //          $ionicHistory.goBack();
            //      }
            //  })
            return $http.post(url, data);
        };
        //获取单篇文章评论列表
        this.getSingleCom = function(type, source_id, page, count) {
            var url = urls.getComment + "?source_id=" + source_id + "&type=" + type + "&page=" + page + "&count=" + count;
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
        //文章评论内容点赞
        this.addDelLike = function(id, type, source_id) {
                var url = urls.likeAddDel;
                var data = {
                    user_id: id,
                    type: type,
                    source_id: source_id,
                };
                return $http.post(url, data);
            }
            //删除评论
        this.delCom = function() {

        };

        //查看评论
        this.delCom = function() {

        };

        //登录后查看个人评论
        this.getSelfComment = function(user_id) {
            var url = urls.getSelfComment;
            var data = {
                user_id: user_id
            }
            return $http.post(url, data);
        };
    })

.factory('httpInterceptor', function() { //拦截器
        return {
            request: function(config) { //请求发出去之前
                    if (window.localStorage[cache.token]) {
                        config.headers.Authorization = 'Bearer ' + window.localStorage[cache.token];
                    } else {
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
    .factory('httpService', function($q, $http, $rootScope, $ionicLoading, $ionicPopup, $state, fn) {
        var httpGet = function(api, params) {
            params = params || {};
            var deferred = $q.defer();
            var promise = deferred.promise;
            //$http.get(domain + api + fn.getDataJson(params))
            $http.get(api + fn.getDataJson(params))
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(error) {
                    console.log("httpGet error:" + angular.toJson(error)); //可以把httpGet error换成loading hide()。
                    deferred.reject(error);
                })
                .finally(function() {});
            return promise;
        };
        var httpPost = function(api, params) {
            params = params || {};
            var deferred = $q.defer();
            var promise = deferred.promise;
            //$http.post(domain + api, params)
            $http.post(api, params)
                .success(function(data) {
                    deferred.resolve(data);
                })
                .error(function(error) {
                    console.log("httpPost error:" + angular.toJson(error));
                    deferred.reject(error);
                })
                .finally(function() {});
            return promise;
        };
        return {
            httpPost: httpPost,
            httpGet: httpGet
        };
    })
    .service('fn', function() {
        this.getDataJson = function(objs) {
            var json = '';
            if (objs) {
                angular.forEach(objs, function(value, key) {
                    json += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
                });
                json = '?' + json.substring(0, json.length - 1);
            }
            return json;
        };
    })
