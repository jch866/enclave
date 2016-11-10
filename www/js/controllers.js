var myApp = angular.module('starter.controllers', []);
myApp.controller('homeCtrl', function($scope, $ionicTabsDelegate, getArticleList, $http, $ionicPopup, $timeout,
    $cordovaDatePicker, $rootScope, $cordovaNetwork, AccountService, $ionicLoading, $ionicPlatform,$ionicSlideBoxDelegate ) {
    //categoryDate, 
    var userId = window.localStorage[cache.userId];
    var page = 1,
        count = 10;
    var isLock = false;
    $scope.items ={
        articles:[],
        categories:[]
    };
    var cate = {

             title: "专题",
             type: "article",
             isload: true,
           urlApi: urls.getCategory + "?have_data=0",
    };
    //items.categories
    $scope.hasMore = true;
    $scope.currentSlide = "slide1";
    // $scope.topTabs = categoryDate.getCate();
    $scope.slideChanged = function(index) {
       // 获取对象配置
      if(index ==1){
        $http.get(cate.urlApi).then(function(response) {
                    console.log(response);
                     $scope.items.categories = response.data.result.categories.data; 
                }, function(error) {
                    console.log("doRefresh error");
                }).finally(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                });
            }else{
                hasArtCache($scope);
            }
        //选中tabs
        //$ionicTabsDelegate.select(index);
    };

    $scope.$on('$ionicView.afterEnter', function() {
        //选中tabs
        $ionicTabsDelegate.select($ionicSlideBoxDelegate.$getByHandle($scope.currentSlide).currentIndex());
    });

    $scope.selectedTab = function(index) {
        //滑动的索引和速度
        $ionicSlideBoxDelegate.slide(index)
    }
    $scope.$on('$ionicView.beforeEnter', function() {
        console.log('已经成为活动视图');
       // $ionicTabsDelegate.showBar(true);
    });

    var fresh = function() {
        return getArticleList.getArticles(userId, 1, count).success(function(resp) {
            console.log(resp);
            if (resp.code == "200") {
                $scope.items.articles = resp.result.data;
                window.localStorage[articleCache.list] = JSON.stringify(resp.result.data);
                $scope.hasContent = true;
                $scope.hasMore = true;
                page = 2;
            } else {
                $scope.hasContent = false;
                $scope.hasMore = false;
                //当页面加载不到文件的时候;应该提示客户
            }
        }).error(function(error) {
            console.log("error");
        })
    }
    fresh();
    var hasArtCache = function($scope) {
        if (window.localStorage[articleCache.list]) {
            $scope.items.articles = angular.fromJson(window.localStorage[articleCache.list])
        } else { fresh() };
    }
    hasArtCache($scope);

    $scope.$on('$ionicView.beforeEnter', function() {
        var _user = AccountService.getCacheUser();
        $rootScope.user = (_user == undefined) ? {} : _user;
    })


    $scope.loadMore = function() {
        getArticleList.getArticles(userId, page, count).success(function(resp) {
            if (resp.code == "200") {
                if (resp.result.data.length > 0) {
                    $scope.items.articles = $scope.items.articles.concat(resp.result.data);
                    page++;
                } else {
                    console.log("没有数据了...")
                        //isLock = true;
                    $scope.hasMore = false;
                }
            } else if (resp.code == "404") {
                $scope.hasMore = false;
                $ionicLoading.show({
                    template: "文章加载完毕！",
                    noBackdrop: true
                })
                $timeout(function() {
                    $ionicLoading.hide();
                }, 1000)

            }
        }).finally(function(error) {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            // $scope.$broadcast('scroll.refreshComplete');
        });
    }
    $scope.doRefresh = function() {
        fresh().finally(function() {
            // $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.$broadcast('scroll.refreshComplete');
        })
    }


});

myApp.controller('categoryArticleListCtrl', function($scope, $state,$stateParams,cateService) {
    $scope.info = {
        cateArts:[],
        cateHead:null
    }
    var cateId = $stateParams.cate_id - 0;
    cateService.getCateList(1,cateId).then(function(res){
        console.log(res);
        if(res.data.code ==404){
             $scope.noArt = true;
            $scope.noArtMsg = res.data.message;
        }
        if(res.status == 200 && res.data.code !==404){
            $scope.info.cateArts = res.data.result.articles.data;
            $scope.info.cateHead = res.data.result.category[0];
        }else{
            var tip = res.message;
            console.log(tip);
        }       
    },function(err){
        console.log("categoryArticleList error");
    }).finally(function(){

    })

})
myApp.controller('categoryArticleDetailCtrl', function($scope, $state,$stateParams,cateService) {
    var cateId =  $stateParams.cate_id;
    var artId =  $stateParams.art_id;
    console.log($stateParams);

    cateService.getCateArtDetail().then(function(res){
        console.log(res);
    },function(){

    }).finally(function(){

    })

})
myApp.controller('loginCtrl', function($scope, AccountService, $state, $ionicPopup, $ionicHistory) {
    $scope.phone = {
        tel: ''
    };
    $scope.checkSendCode = function() {
        var phone = $scope.phone.tel;
        var phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (!phoneReg.test(phone) || phone == "" || phone == undefined) {
            $ionicPopup.alert({ title: '提示', template: "请输入有效的手机号码！" })
            return false;
        } else {
            AccountService.reg(phone).success(function(resp) {
                console.log(resp);
                //超过同一手机发送验证码次数上限，改天再试
                if (resp.status[0] == 160040) {
                    $ionicPopup.alert({ title: '提示', template: resp.message[0] })
                    return;
                } else {
                    var sendSeconds = new Date().getTime();
                    window.localStorage[cache.sendCodeTime] = sendSeconds; //时间戳   todo设置过期时间
                    $state.go("loginCode", { phone: $scope.phone.tel });
                }
            }).error(function(error) {
                console.log(error);
            });


        }
    }
    $scope.sendCode = function() {
        var firstSendTime = window.localStorage[cache.sendCodeTime];
        var nowTime = new Date().getTime();
        var expireTime = nowTime - firstSendTime;
        if (!firstSendTime || expireTime > DELEY * 1000) {
            $scope.checkSendCode();
        } else {
            $state.go("loginCode", { phone: $scope.phone.tel });
        }
        //TODO提示不能重新发送验证码 间隔时间过短
    };
});
myApp.controller('loginCodeCtrl', function($scope, $rootScope, $stateParams, $state, $ionicPopup, AccountService, $timeout, $ionicHistory, $ionicLoading) {
    var phone = $stateParams.phone;
    $scope.data = {
        code: ""
    }
    $scope.completeLogin = function() {
        var code = $scope.data.code;
        var codeReg = /^\d{6}$/;
        if (!codeReg.test(code)) {
            $ionicPopup.alert({ title: '提示', template: "请输入有效的验证码！" })
            return false;
        } else {
            AccountService.login(phone, code).success(function(resp) {
                console.log(resp);
                if (resp.code == "200") {
                    window.localStorage[cache.smsId] = resp.result.id;
                    if (resp.result && resp.result.nickname) {
                        window.localStorage[cache.logined] = "true";
                        window.localStorage[cache.token] = resp.result.token;
                        window.localStorage[cache.userId] = resp.result.user_id;
                        window.localStorage[cache.user] = JSON.stringify(resp.result);
                        $rootScope.user = AccountService.getCacheUser();
                        $state.go("home");
                        $ionicLoading.show({
                            template: "登录成功!",
                            noBackdrop: true
                        })
                        $timeout(function() {
                                $ionicLoading.hide();
                            }, 1000)
                            //$ionicPopup.alert({ title: '提示', template: "登录成功" })
                        $ionicHistory.nextViewOptions({
                            disableAnimate: false,
                            disableBack: true
                        });
                    } else {
                        $state.go("loginComplete");
                    }
                } else if (resp.code == "403") {
                    $ionicPopup.alert({ title: '提示', template: resp.message });
                }
            }).error(function(error) {
                $ionicPopup.alert({ title: '提示', template: "服务器错误" });
                removeInfo();
            });
        }

    };
    $scope.sendButTxt = DELEY + '秒后重发';
    $scope.sendState = 0;
    $timeout(function() {
        $scope.sendSMS(DELEY);
    }, 1000);
    $scope.reSend = function() {
        if ($scope.sendState != 1) {
            return;
        }
        AccountService.reg(phone).success(function(resp) {
            console.log(resp);
            if (resp.status == 0) {
                $scope.sendSMS(DELEY);
            }
        }).error(function(error) { console.log(error); });
    };
    $scope.sendSMS = function(i) {
        if (i > 0) {
            $scope.sendButTxt = i + '秒后重发';
            $scope.sendState = 0;
            i--;
            $timeout(function() {
                $scope.sendSMS(i);
            }, 1000);
        } else {
            $scope.sendButTxt = '发送验证码';
            $scope.sendState = 1;
        }
    };
});


myApp.controller('loginCompleteCtrl', function($scope, $rootScope, $ionicPopup, $cordovaCamera, $ionicActionSheet, AccountService, $state,
    $ionicHistory, $location, $ionicLoading, $timeout) {
    var token = "";
    var userId = "";
    var smsId = window.localStorage[cache.smsId] - 0;
    $scope.userInfo = {
        avatar: curUser.avatar,
        name: "",
        sex: "女",
        birthday: "19990101"
    }
    var userInfo = $scope.userInfo;
    $scope.complete = function() {
        var regName = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9_\u4E00-\u9FA5]{1,15}$/;
        var regSex = /^['男'|'女']$/;
        var regBirth = /^(19|20)\d{2}(1[0-2]|0[1-9])(0[1-9]|[1-2][0-9]|3[0-1])$/;

        if (!userInfo.name || !regName.test(userInfo.name)) {
            $ionicPopup.alert({ title: '提示', template: "昵称由字母、数字、下划线和中文组成，以中文或字母开头，长度为2-16位" });
            return false;
        }
        if (userInfo.sex && !regSex.test(userInfo.sex)) {
            $ionicPopup.alert({ title: '提示', template: "选填，‘男’或者‘女’" });
            return false;;
        }
        if (userInfo.birthday && !regBirth.test(userInfo.birthday)) {
            $ionicPopup.alert({ title: '提示', template: "选填，生日格式:19990101" });
            return false;;
        }
        AccountService.uploadUser(userInfo, smsId).success(function(resp) {
            console.log(resp);
            if (resp.code == "200") {
                $ionicLoading.show({
                    template: "注册成功!",
                    noBackdrop: true
                })
                $timeout(function() {
                        $ionicLoading.hide();
                    }, 1000)
                    // $ionicPopup.alert({ title: '提示', template: "注册成功" })
                $state.go("home");
                window.localStorage[cache.logined] = "true";
                token = window.localStorage[cache.token] = resp.result.token;
                userId = window.localStorage[cache.userId] = resp.result.user_id;
                userId && AccountService.getUserInfo(userId);
                $ionicHistory.nextViewOptions({
                    disableAnimate: false,
                    disableBack: true
                });

            } else if (resp.code == "4000") {
                $ionicPopup.alert({ title: '提示', template: "token问题" })
            } else if (resp.code == "400") {
                $ionicPopup.alert({ title: '提示', template: resp.message })
            } else {
                $ionicPopup.alert({ title: '提示', template: "有问题" }) //resp.message
            }
        }).error(function(error) {
            $ionicPopup.alert({ title: '提示', template: "服务器错误" }) //error
        })

    }

    var callCamera = function(sourceType) {
        var options = {
            quality: 100, //图片质量 100为最佳
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: sourceType, // PHOTOLIBRARY = 0  CAMERA = 1  SAVEDPHOTOALBUM = 2
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };
        $cordovaCamera.getPicture(options).then(function(imageData) {
            var image = document.getElementById('myImage');
            $scope.userInfo.avatar = "data:image/jpeg;base64," + imageData;
        }, function(err) {
            console.log("发生错误");
        });
    }
    $scope.changeAvatar = function() {
        $ionicActionSheet.show({
            buttons: [
                { text: '<span class="selectImg">相机</span>' },
                { text: '<span class="selectImg">从手机相册选择</span>' },
            ],
            titleText: '选择调用类型?',
            cancelText: '<span class="selectCancel">Cancel</span>',
            buttonClicked: function(index) {
                switch (index) {
                    case 0:
                        callCamera(Camera.PictureSourceType.CAMERA)
                        break;
                    case 1:
                        callCamera(Camera.PictureSourceType.PHOTOLIBRARY)
                        break;
                    default:
                        break;
                }
                return true;
            }
        })
    }


});

myApp.controller('sideMenuCtrl', function($scope, $rootScope, $location, $anchorScroll, $ionicModal, AccountService, $http, $state) {
    $scope.openLogin = function() {
        var logined = window.localStorage[cache.logined];
        var _user = AccountService.getCacheUser();
        if (logined == "true" && _user && _user.nickname) {
            $state.go("usercenter");
        } else {
            $state.go("login");
        }
    }
    $scope.goMessage = function() {
        AccountService.goState("message");
    }
    $scope.goFav = function() {
        AccountService.goState("favourite");
    }
    $scope.goComment = function() {
        AccountService.goState("comment");
    }
    $scope.goSetting = function() {
        $state.go("setting");
    }

});

myApp.controller('usercenterCtrl', function($scope, $rootScope, AccountService, $state, $ionicHistory, $ionicPopup, $ionicActionSheet) {
    var userId = window.localStorage[cache.userId];
    console.log(userId);
    AccountService.getUserInfo(userId); //切换用户时
    $rootScope.user = AccountService.getCacheUser(); //取localstorage的值
    $scope.doRefresh = function() {
        AccountService.getUserInfo(userId);
        $scope.$broadcast('scroll.refreshComplete');
    }
    $scope.loginOut = function() {
        removeInfo();
        $rootScope.user = {}
        console.log("注销成功");
        $state.go("home");
        $ionicHistory.nextViewOptions({
            disableAnimate: false,
            disableBack: true
        });
    }
});


myApp.controller('settingCtrl', function($scope, $state) {
    $scope.settingsList = {
        msg_push: true, //消息推送
        wifi_autoCache: true, //自动缓存
        network_play: false // 移动网络播放视频
    };
    $scope.appCache = '9.18M';
    //清除缓存
    $scope.clearCache = function() {
        $scope.appCache = '0M';
    };
    //推荐飞地
    $scope.tuijian = function() {
        console.log("推荐飞地");
    };
    //给个好评
    $scope.givePraise = function() {
        console.log("给个好评");
    };
});
myApp.controller('articleDetailCtrl', function($scope, $state, $stateParams, $ionicActionSheet,
    $ionicPopup, $timeout, ArticleService, FavService, ComService, $ionicLoading, AccountService) {
    var artId = 0;
    var type = "article";
    var page = 1;
    var count = 10;
    $scope.hasMedia = true;
    var art_id = $stateParams.art_id - 0;
    //var isAdd = $stateParams.data?$stateParams.data.isAdd:false;
    var userId = window.localStorage[cache.userId] ? (window.localStorage[cache.userId] - 0) : undefined;

    //分享 
    $scope.share = function() {

        // var options = {
        //     message: 'share this', // not supported on some apps (Facebook, Instagram)
        //     subject: 'the subject', // fi. for email
        //     files: ['', ''], // an array of filenames either locally or remotely
        //     url: 'https://www.website.com/foo/#bar?a=b',
        //     chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
        // }

        // var onSuccess = function(result) {
        //     console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
        //     console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
        // }

        // var onError = function(msg) {
        //     console.log("Sharing failed with message: " + msg);
        // }

        // window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
    }

    //点赞功能 
    // $scope.addLike = false;
    $scope.getLike = function(comment) {
        var type = "comment";
        var comment_id = comment.id;
        ComService.addDelLike(userId, type, comment_id).success(function(resp) {
            console.log(resp);
            //$scope.addLike = true;
            comment.likecount = resp.result.count;
        }).error(function(error) {
            console.log("点赞：error");
        })
    }

    function getComments() {
        ArticleService.getDetails(art_id, userId).success(function(resp) {
            console.log(resp);
            $scope.item = resp.result;
            artId = resp.result.art_id;
            mediaOption.file = resp.result.art_media;
            mediaOption.image = resp.result.art_thumb;
            $scope.hasMedia = resp.result.art_media ? true : false;
            $scope.flag.isAdd = (resp.result.collected == 0) ? false : true;
        }).success(function() {
            ComService.getSingleCom(type, artId, page, count).success(function(resp) {
                console.log(resp);
                if (resp.code == 200) {
                    $scope.hasComment = true;
                    var data = resp.result.data.reverse();
                    var comments = [];
                    angular.forEach(data, function(item) {
                        var c = {
                            id: item.id,
                            nickname: item.author.nickname,
                            avatar: item.author.avatar,
                            content: item.content,
                            publishTime: item.publishTime,
                            sourceId: item.sourceId,
                            likecount: item.likecount,
                            comments: []
                        };
                        var isChild = false;
                        for (var i = 0; i < comments.length; i++) {
                            if (item.pid == comments[i].id) {
                                isChild = true;
                                comments[i].comments.push(c)
                                break;
                            }
                        }
                        if (isChild == false) {
                            comments.push(c);
                        }
                    });
                    $scope.comments = comments.reverse();
                    $scope.currentArticleComTotal = resp.result.pageInfo.total;
                };
                if (resp.code == 404) {
                    $scope.hasComment = false;
                    $scope.currentArticleComTotal = 0;
                    $scope.noComment = resp.message //没有任何评论信息
                }
            }).error(function(error) { console.log(error); });
        }).error(function(error) { console.log(error); })
    }
    /**
     及时更新最新的评论 监听beforeEnter
     */
    $scope.$on('$ionicView.beforeEnter', function() {
            // console.log("$ionicView.beforeEnter");
            getComments();
        })
        /**
         判断当时的媒体是视频音频还是图片
         */
    $scope.$on('$ionicView.enter', function() {
        //console.log("$ionicView.enter");
        if ($scope.hasMedia) { //todo 多切换几个文章试试有无报错
            jwplayer("art_media").setup(mediaOption);
        }
        //音频播放背景图片的问题
    });
    $scope.pubComment = function() {
        AccountService.goState("comment_pub", $scope.item);
    };
    $scope.replyCom = function() {
        AccountService.goState("comment_reply", this.comment);
        //针对用户的判断是不是本人 id==pid  TODO
    };
    /**
     * 添加收藏
     * @type {Object}
     */
    $scope.flag = {
        isAdd: false,
        tipTest: ''
    };
    $scope.addFavorites = function() {
        //todo login状态
        if (!window.localStorage[cache.logined] === "true") {
            $ionicLoading.show({
                template: "请登录!",
                noBackdrop: true
            })
            $timeout(function() {
                $ionicLoading.hide();
            }, 1000)
        } else {
            FavService.addDelFav(userId, art_id).success(function(resp) {
                console.log(resp);
                //add cancel
                $scope.flag.isAdd = (resp.result.type == "add") ? true : false;
            }).success(function() {
                $scope.flag.tipTest = $scope.flag.isAdd ? "收藏成功" : "取消收藏";
                $ionicLoading.show({
                    template: $scope.flag.tipTest,
                    noBackdrop: true
                })
                $timeout(function() {
                    $ionicLoading.hide();
                }, 1000)
            }).error(function() {
                console.log("添加收藏失败");
            })
        }
    };

});
//收藏列表
myApp.controller('favListCtrl', function($scope, $state, $stateParams, $ionicHistory, $ionicPopup, FavService, $ionicLoading, $timeout) {
    var user_id = window.localStorage[cache.userId] - 0;
    var page = 1,
        count = 10;
    $scope.$on('$ionicView.beforeEnter', function() {
        console.log("收藏列表 ++++ beforeEnter");
        getFavList();
    })
    var getFavList = function() {
        FavService.getFavList(user_id, page, count).success(function(resp) {
            console.log(resp);
            if (resp.code == 200) {
                $scope.favFlag = true;
                $scope.favData = resp.result.data;
            } else {
                $scope.favFlag = false;
            }
            if (resp.code == 400) {
                $ionicLoading.show({
                    template: "用户不存在！",
                    noBackdrop: true
                })
                $timeout(function() {
                    $ionicLoading.hide();
                }, 1000)
            }
        }).error(function() {
            console.log("获取收藏列表失败");
        })
    }
    $scope.goDetails = function(id) {
        $state.go("article", {
            art_id: id
        })
    }
})

//回复评论
myApp.controller('replyCommentCtrl', function($scope, $state, $stateParams, ComService, $ionicHistory, $ionicPopup) {
    var data = $stateParams.data;
    $scope.commentItem = data;
    $scope.replyComment = {
        content: ""
    };
    console.log($scope.commentItem);
    $scope.reply_send = function() {
        var content = $scope.replyComment.content;
        var userId = window.localStorage[cache.userId] - 0;
        var type = "article";
        var source_id = $scope.commentItem.sourceId;
        var pid = $scope.commentItem.id || 0;
        ComService.pubCom(userId, type, source_id, content, pid).success(function(resp) {
            console.log(resp);
            if (resp.code == 404) {
                $ionicPopup.alert({ title: '提示', template: resp.message });
            }
            if (resp.code == 200) {
                $ionicHistory.goBack();
            }
        }).error(function(error) {
            console.log(error);
        });
    }

})

//发布评论
myApp.controller('pubCommentCtrl', function($scope, $state, $stateParams, ComService, $ionicHistory, $ionicPopup) {
        var data = $stateParams.data;
        $scope.item = data;
        $scope.pubCom = {
            content: ""
        }
        $scope.art_public = function() {
            var content = $scope.pubCom.content;
            var userId = window.localStorage[cache.userId] - 0;
            var type = "article";
            var source_id = $scope.item.art_id;
            var pid = pid || 0;
            ComService.pubCom(userId, type, source_id, content, pid).success(function(resp) {
                console.log(resp);
                if (resp.code == 4003) {
                    $ionicPopup.alert({ title: '提示', template: resp.message });
                }
                if (resp.code == 200) {
                    $ionicHistory.goBack();
                }
            }).error(function(error) {
                console.log(error);
            });
        }

    })
    //个人评论列表
myApp.controller('commentListCtrl', function($scope, $state, $stateParams, ComService, $ionicHistory, $ionicPopup, $ionicLoading, $timeout) {
    var user_id = window.localStorage[cache.userId] - 0;
    ComService.getSelfComment(user_id).success(function(resp) {
        console.log(resp);
        if (resp.code == 200) {
            $scope.hasCommentMsg = true;
            $scope.selfComList = resp.result.data;
        };
        if (resp.code == 404) {
            $scope.hasCommentMsg = false;
            $scope.CommentMsg = resp.message
        }
        if (resp.code == 4003) {
            $scope.hasCommentMsg = false;
            $ionicLoading.show({
                template: "用户不存在！",
                noBackdrop: true
            })
            $timeout(function() {
                $ionicLoading.hide();
            }, 1000)
        }
    }).error(function(error) {
        $ionicLoading.show({
            template: "请求数据失败，稍后再试",
            noBackdrop: true
        })
        $timeout(function() {
            $ionicLoading.hide();
        }, 1000)
    })
    $scope.goDetails = function(id) {
        $state.go("article", {
            art_id: id
        })
    }
})

myApp.controller('BaseCtrl', function($scope, $ionicHistory) {

});
myApp.controller('messageCtrl', function($scope, $ionicHistory) {});
