var myApp = angular.module('starter.controllers', []);
myApp.controller('homeCtrl', function($scope, $ionicTabsDelegate, getArticleList, $http) {

    //console.log(getArticleList);
    var art = getArticleList.all();
    // console.log(art);
    $scope.imgUrl = urls.imgUrl;
    //测试用静态数据
    $scope.array = getArticleList.data;
    $scope.items = art;
    // $scope.doRefresh=function(){
    //     getArticleList.doRefresh();
    //     $scope.$broadcast("scoll.refreshComplete")
    // };  
    //阅读数
    // $scope.readNum=function(){
    //     var readNum = config.art_read
    //     //判断用户状态，并认定只有同一个ID才能加1
    //     if(localStorage.username==""){
    //         readNum++;
    //         config.art_read = redNum;
    //     }else{
    //          state.go("")
    //     }
    // }
    // $scope.doRefresh = function() {
    //     $http.get('/new-items').success(function(newItems) {
    //         $scope.items = newItems;
    //     }).finally(function() {
    //         // 停止广播ion-refresher
    //         $scope.$broadcast('scroll.refreshComplete');
    //     });  
    // };




    //  $scope.items = [];

    $scope.doRefresh = function() {
        // $http.get(urls.getArticles).success(function(data) {
        //     console.log(data);
        //     $scope.items.concat(data.result);
        // }).error(function(err) {
        //     console.log(err);
        // });

        var array = $scope.array;
        //$scope.items=$scope.items.concat(array);
        Array.prototype.unshift.apply($scope.items, array);
        $scope.$broadcast("scroll.refreshComplete");
    };

    // var page = 1,isLock=false;
    // $scope.items = [];
    // $scope.loadMore = function () {
    //     if(isLock)return;
    //     isLock=true;
    //     getArticleList.getList(classify[0].url, page).success(function (response) {
    //         console.log(page)
    //         if (response.tngou.length == 0) {
    //             $scope.hasmore = true;
    //             return;
    //         }
    //         page++;
    //         $scope.items = $scope.items.concat(response.tngou);
    //     }).finally(function (error) {
    //         isLock = false;
    //         $scope.$broadcast('scroll.infiniteScrollComplete');
    //         $scope.$broadcast('scroll.refreshComplete');
    //     });
    // };
    // $scope.doRefresh = function () {
    //     page = 1;
    //     $scope.items = [];
    //     $scope.loadMore();
    // }
});


myApp.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
});
myApp.controller('loginCtrl', function($scope, AccountService, $state,$ionicPopup,$ionicHistory) {
    $scope.phone = {
        tel: ''
    };
    $scope.checkSendCode = function() {
        var phone = $scope.phone.tel;
        var phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (!phoneReg.test(phone) || phone =="" || phone == undefined) {
             $ionicPopup.alert({ title: '提示', template:"请输入有效的手机号码！"})
            return false;
        } else {
            AccountService.reg(phone).success(function(resp) {
                console.log(resp);
                //超过同一手机发送验证码次数上限，改天再试
                if(resp.status[0]==160040){
                    $ionicPopup.alert({ title: '提示', template:resp.message[0]})
                    return;
                }else{
                    var sendSeconds = new Date().getTime();
                    // var wsCache = new WebStorageCache();
                    window.localStorage[cache.sendCodeTime] = sendSeconds;
                    //wsCache.set("sendCodeTime", sendSeconds); //时间戳   todo设置过期时间
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
        if (!firstSendTime || expireTime > DELEY*1000) {
            $scope.checkSendCode();
        } else {
            $state.go("loginCode", { phone: $scope.phone.tel });
        }
 
        // else if( expireTime < DELEY){
        //     //提示不能重新发送验证码
        //     alert("间隔时间过短");
        //     //$ionicPopup
        // }

    };
});
myApp.controller('loginCodeCtrl', function($scope,$rootScope, $stateParams, $state, $ionicPopup, AccountService, $timeout,$ionicHistory) {
    var phone = $stateParams.phone;
    $scope.data = {
        code: ""
    }
    //{"status":0,"message":"发送成功"}
    $scope.completeLogin = function() {
        var code = $scope.data.code;
        var codeReg = /^\d{6}$/;
        if (!codeReg.test(code)) {
            $ionicPopup.alert({ title: '提示', template:"请输入有效的验证码！"})
            return false;
        } else {
            AccountService.login(phone, code).success(function(resp) {
                console.log(resp);
                //{status: "error", code: 404, message: "昵称还没有设置"}
                //{status: "error", code: 403, message: "登录失败, 登录验证码错误"}
                if (resp.code == "200") {
                    window.localStorage[cache.logined]="true";
                    window.localStorage[cache.token]=resp.result.token;
                    window.localStorage[cache.userId]=resp.result.id;
                  
                    if(resp.result.nickname){
                        // 相当于AccountService.getUserInfo(id);此处已经返回userinfo
                        // 这是用户登录后
                        window.localStorage[cache.user] = JSON.stringify(resp.result);
                        $rootScope.user = AccountService.getCacheUser();
                        $state.go("home");
                        $ionicPopup.alert({ title: '提示', template:"登录成功"  }) 
                        $ionicHistory.nextViewOptions({
                          disableAnimate: false,
                          disableBack: true
                        });
                    }else{
                        $state.go("loginComplete");
                    }
                    
                    //第几次登录，判断要不要进入完善信息页
                   // AccountService.getUserInfo(resp.result.id);
                   // var a = AccountService.getCacheUser().nickname
                    // if(a){
                    // return}else{
                    // $state.go("loginComplete");
                    // }
                     
                    
                }else if (resp.code == "403") {
                    $ionicPopup.alert({ title: '提示', template: resp.message });
                }else if (resp.code == "404") { //|| !resp.result.nickname
                    window.localStorage[cache.logined]="true";
                    window.localStorage[cache.token]=resp.result.token;
                    window.localStorage[cache.userId]=resp.result.id;
                    $state.go("loginComplete");
                }else {
                    // {status: "success", code: 200, message: "注册成功", 
                    // result: {token: "eyJ0eXPwOY", expiryTime: "1474518492", 
                    // id: 6} }
                    window.localStorage[cache.logined]="true";
                    window.localStorage[cache.token]=resp.result.token;
                    window.localStorage[cache.userId]=resp.result.id;
                    // wsCache.set("logined", true);
                    // wsCache.set("userToken", resp.result.token);
                    // wsCache.set("userId", resp.result.id);
                    $state.go("loginComplete");
                    console.log(window.localStorage[cache.token]+"----regSuccess");
                }
                // else if (resp.code == "404" || !resp.result.nickname) {
                //     $state.go("loginComplete");
                // } 
            }).error(function(error) { 
                $ionicPopup.alert({title: '提示', template:"网络连接错误"});
                removeInfo();
                //console.log(error); 
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


myApp.controller('loginCompleteCtrl', function($scope,$rootScope, $ionicPopup, $cordovaCamera, $ionicActionSheet,AccountService, $state, 
    $ionicHistory, $location) {
    var token =window.localStorage[cache.token] 
    var id = window.localStorage[cache.userId]  
    // console.log(token+"----complete");
    $scope.userInfo  = {
        avatar:"",
        name: "",
        sex: null,
        birthday:null
    } 
    var userInfo = $scope.userInfo;
    var avlidate = function(){
        var regName=/^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9_\u4E00-\u9FA5]{1,15}$/;
        var regSex= /^['男'|'女']$/;
        var regBirth=/^(19|20)\d{2}(1[0-2]|0[1-9])(0[1-9]|[1-2][0-9]|3[0-1])$/;

        if(!userInfo.name||!regName.test(userInfo.name)){
            $ionicPopup.alert({ title: '提示', template: "昵称由字母、数字、下划线和中文组成，以中文或字母开头，长度为2-16位"});
            return false;
        }
        if(userInfo.sex && !regSex.test(userInfo.sex)){
            $ionicPopup.alert({ title: '提示', template: "选填，‘男’或者‘女’"});
             return false;;
        }
        if(userInfo.birthday && !regBirth.test(userInfo.birthday)){
            $ionicPopup.alert({ title: '提示', template: "选填，生日格式:19990101"});
            return false;;
        }
    };
    $scope.complete = function() {
       // var reg = /[a-zA-Z0-9]{1,10}|[\u4e00-\u9fa5]{1,5}/g;
        var regName=/^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9_\u4E00-\u9FA5]{1,15}$/;
        var regSex= /^['男'|'女']$/;
        var regBirth=/^(19|20)\d{2}(1[0-2]|0[1-9])(0[1-9]|[1-2][0-9]|3[0-1])$/;

        if(!userInfo.name||!regName.test(userInfo.name)){
            $ionicPopup.alert({ title: '提示', template: "昵称由字母、数字、下划线和中文组成，以中文或字母开头，长度为2-16位"});
            return false;
        }
        if(userInfo.sex && !regSex.test(userInfo.sex)){
            $ionicPopup.alert({ title: '提示', template: "选填，‘男’或者‘女’"});
             return false;;
        }
        if(userInfo.birthday && !regBirth.test(userInfo.birthday)){
            $ionicPopup.alert({ title: '提示', template: "选填，生日格式:19990101"});
            return false;;
        }
        AccountService.uploadUser(token, id, userInfo).success(function(resp) {
            console.log(resp);
            //{status: "error", code: 4003, message: "user不存在"}
            if (resp.code == "200") {
            $ionicPopup.alert({ title: '提示', template:"注册成功"  }) 
                $state.go("home");
                //这是用户首次注册成功后，保存信息
                id && AccountService.getUserInfo(id);
                $rootScope.user = AccountService.getCacheUser();
                 $ionicHistory.nextViewOptions({
                  disableAnimate: false,
                  disableBack: true
                });

            } else if(resp.code == "4000"){
                 $ionicPopup.alert({ title: '提示', template:"token问题"  }) 
            }else if(resp.code == "400"){
                 $ionicPopup.alert({ title: '提示', template:resp.message  }) 
            }else {
                $ionicPopup.alert({ title: '提示', template:"有问题"  }) //resp.message
            }
        }).error(function(error) {
            $ionicPopup.alert({ title: '提示', template:"连接网络失败" })//error
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
            $scope.userInfo.avatar= "data:image/jpeg;base64," + imageData;
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
            // destructiveText: 'Delete',
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

myApp.controller('sideMenuCtrl', function($scope,$rootScope, $location, $anchorScroll, $ionicModal, AccountService, $http, $state) {
     var _user = AccountService.getCacheUser();
     $rootScope.user = (_user == undefined)?{}: _user;
     // $rootScope.user={}      //avatar:"img/ben.png"
    $scope.openLogin = function() {
        var logined=window.localStorage[cache.logined];
        if (logined=="true") {
            $state.go("usercenter");
        } else {
            $state.go("login");
        }
    }
    $scope.goMessage = function() {
        $state.go("message");
    }
    $scope.goFav = function() {
        $state.go("favourite");
    }
    $scope.goSetting = function() {
        $state.go("setting");
    }
    $scope.goComment = function() {
        $state.go("comment");
    }
});

myApp.controller('usercenterCtrl', function($scope,$rootScope, AccountService, $state, $ionicHistory, $ionicPopup,$ionicActionSheet) {

    var id = window.localStorage[cache.userId];
    console.log(id);
    
    AccountService.getUserInfo(id);
    $scope.user = AccountService.getCacheUser();//取localstorage的值
    $scope.doRefresh = function() {
        AccountService.getUserInfo(id);
        $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.loginOut = function() {
        removeInfo();
        $rootScope.user= {}
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
    $ionicPopup, $timeout, getArticleList, ArticleService,FavService,ComService) {
    
    var artId=0;
    var type = "article";
    var page=1;
    var count=10;
    $scope.imgUrl = urls.imgUrl;
    console.log($stateParams);
    var id = $stateParams.art_id;
    ArticleService.getDetails(id).success(function(resp) {
        console.log(resp);
        $scope.item = resp.result;
        artId = resp.result.art_id;
        mediaOption.file = resp.result.art_media;
        mediaOption.image = $scope.imgUrl + resp.result.art_thumb;
        if(resp.result.art_media){
           // $scope.hasMedia=true;
            $scope.html = '<div id="art_media"></div>'
        }else{
            //$scope.hasMedia=false;
            $scope.html = '<img  alt="" src="'+$scope.imgUrl+$scope.item.art_thumb+'">'
        }
    }).success(function(){
        ComService.getSingleCom(type, artId, page, count).success(function(resp){
        console.log(resp);
        if(resp.code==200){
            $scope.currentArticleComList = resp.result.data;
            $scope.currentArticleComTotal = resp.result.pageInfo.total
        };
        //resp.code==400
        //{status: "error", code: 400, message: "type字段不能为空"}
        }).error(function(error){

        });
    }).error(function(error) { console.log(error);})

    console.log(mediaOption.media);

    $scope.$on('$ionicView.enter',function(){
      console.log("$ionicView.enter");
      var media = $("#art_media");
      if(media){   //todo 多切换几个文章试试有无报错
          jwplayer("art_media").setup(mediaOption);
        } 
      
      //音频播放背景图片的问题
    });
    $scope.$on('refreshCom',function(){
        ComService.getSingleCom(type, artId, page, count).success(function(resp){
        console.log(resp);
        if(resp.code==200){
            $scope.currentArticleComList = resp.result.data;
            $scope.currentArticleComTotal = resp.result.pageInfo.total
        };
        //resp.code==400
        //{status: "error", code: 400, message: "type字段不能为空"}
        }).error(function(error){

        });
    });


    // //获取评论
    // var type = "article",page=1,count=10;
    // ComService.getSingleCom(type, artId, page, count).success(function(resp){
    //     console.log(resp);
    // }).error(function(error){

    // });

    // $scope.renderMedia=function(){
    //     jwplayer("art_media").setup({
    //         flashplayer: 'js/player.swf',
    //         file: 'media/play.mp4',
    //         width: 500,
    //         height: 350,
    //         image: 'img/ben.png',
    //         dock: false
    //     });
    // }
    // $scope.$on("onRenderFinished",function(onRenderFinishedEvent){
    //     var thePlayer = jwplayer("art_media").setup({
    //         flashplayer: 'js/player.swf',
    //         file: 'media/play.mp4',
    //         width: 500,
    //         height: 350,
    //         image: 'img/ben.png',
    //         dock: false
    //     });
    // })

    $scope.flag = {
        isAdd: false,
        tipTest: ''
    };
    $scope.add = function() {        
        $scope.flag.isAdd = !$scope.flag.isAdd;
        $scope.flag.tipTest = $scope.flag.isAdd ? "收藏成功" : "取消收藏";
        var tip = $ionicPopup.show({
            title: '提示',
            template: "<p style='text-align:center'>" + $scope.flag.tipTest + "</p>"
        })
        $timeout(function() {
            tip.close(); 
        }, 1000)
        //根据ID和token增加收藏数
        //FavService.getFav().success().error();
    };
    $scope.pubComment = function() {
        $state.go("comment_pub",{data:$scope.item});

        // if(window.localStorage[cache.logined]==="true"){
        //      $state.go("comment_pub",{data:$scope.item});
        //  }else{
        //    var tip = $ionicPopup.show({title: '提示',template: "请登录!"})
        //         $timeout(function() {
        //         tip.close(); 
        //     }, 1000)
        //  }
       
    };
    // $scope.share = function(title, desc, url, thumb){
    //    var hideSheet =  $ionicActionSheet.show({
    //         buttons:[
    //             {text:"<b>分享至微信朋友圈</b>"},
    //             {text:"分享给微信好友"},
    //         ],
    //         titleText:"分享",
    //         cancelText:"取消",
    //         cancel:function(){},
    //         buttonClicked:function(index){
    //             if(index==0){
    //                 $scope.shareViaWechat(WeChat.Scene.timeline,title,desc,url,thumb);
    //             }
    //             if(index==1){
    //                 $scope.shareViaWechat(WeChat.Scene.session,title,desc,url,thumb)
    //             }
    //         },
    //     });

    //    // $timeout(function() {
    //    //    hideSheet();
    //    //  }, 2000);
    // };
    // $scope.shareViaWechat = function(scene, title, desc, url, thumb){
    //     var msg = {
    //         title:title?title:"fd标题",
    //         description:desc?desc:"fd描述",
    //         url:url?url:"http://enclavemedia.cn/",
    //         thumb:thumb?thumb:null
    //     };
    //     WeChat.share(msg,scene,function(){
    //         $ionicPopup.alert({
    //             title:"Share success",
    //             template:"Thanks for your support",
    //             okText:"close"
    //         },function(res){
    //             $ionicPopup.alert({
    //                 title:"Share failed",
    //                 template:"error:"+res+".",
    //                 okText:"I know"
    //             })
    //         })
    //     })
    // };
});
//发布评论
myApp.controller('pubCommentCtrl', function($scope, $state, $stateParams, ComService, $ionicHistory, $ionicPopup) {
    $scope.imgUrl = urls.imgUrl;
    var data = $stateParams.data;
    $scope.item = data;
    $scope.pubCom = {
        content: ""
    }

    $scope.art_public = function() {
        var content = $scope.pubCom.content;
        var id = window.localStorage[cache.userId] - 0;
        var type = "article";
        var source_id = $scope.item.art_id;
        var pid = pid || 0;
        var page = 1;
        var count = 10;
        ComService.pubCom(id, type, source_id, content, pid).success(function(resp) {
            console.log(resp);
            if (resp.code == 200) {
                $ionicPopup.alert({ title: '提示', template: resp.message });
                $ionicHistory.goBack();
                //重新获取评论列表
                $scope.$emit("refreshCom")
                // ComService.getSingleCom(type, source_id, page, count).success(function(resp) {
                //     console.log(resp);
                //     if (resp.code == 200) {
                //         //这里的$scope作用域不一样 ？？？
                //         $scope.currentArticleComList = resp.result.data;
                //         $scope.currentArticleComTotal = resp.result.pageInfo.total
                //     };
                //     //resp.code==400
                //     //{status: "error", code: 400, message: "type字段不能为空"}
                // }).error(function(error) {})
            }
        }).error(function(error) {
            console.log(error);
        });
    }

})



// 用户中心
//myApp.controller('loginController', function($scope) {
myApp.controller('usercenter', function($scope, $http) {
    //     $scope.user = {};
    //     $scope.user.username = '';
    //     $scope.user.password = '';
    //     $scope.user.headface = 'img/adam.jpg';

    //     if(localStorage.logined =="true"){
    //         //已经登录，不跳转，显示用户信息
    //          $scope.user.headface="img/"+localStorage.username+".jpg";
    //     }else{
    //         var modal=Modal.create({"login.html"}); //跳转到login页面
    //         modal.onDismiss(function(data){$scope.user.headface = "img/"+data+".jpg";})
    //         this.nav.present(model);
    //     };

    //     $scope.login= function(){
    //         if($scope.user.username==""){
    //             var toast = Toast.create({
    //                 message:"您输入的用户名有误！"，
    //                 duration:2000
    //             })
    //             this.nav.present(toast);
    //         }else{
    //             var loading=Loading.create({
    //                 content:"loading……",
    //                 spinner:"dots",
    //                 duration:3000
    //             })
    //             this.nav.present(loading);
    //             //真实逻辑是去请求登录的API，返回结果后进行loading
    //             //setTimeout(function(){loading.dismisss()},3000)
    //             //模拟密码为1.那就认为是登录成功了，并进行相关保存动作
    //             if( $scope.user.password=="1"){
    //                 localStorage.username=$scope.user.username;
    //                 localStorage.logined="true";
    //                 setTimeout(function() {
    //                     loading.dismiss();//隐藏进度条
    //                     this.viewController.dismiss($scope.user.username);//当前也就是自身页面也隐藏
    //                 }, 1000)
    //             }else{
    //                 var toast = Toast.create({
    //                 message:"登录失败"，
    //                 duration:2000
    //                 })
    //                 this.nav.present(toast);
    //             }
    //         }
    //     };
    //     $scope.loginOut=function(){
    //         localStorage.logined="";
    //         localStorage.username="";
    //         var model=Modal.create({"login.html"});  
    //           modal.onDismiss(function(data){$scope.user.headface = "img/"+data+".jpg";}) 
    //         this.nav.present(model);
    //     };

});
myApp.controller('messageCtrl', function($scope,$ionicHistory) {
  

});
