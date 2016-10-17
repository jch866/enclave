service里
/************************************************************* 文章列表 *************************************************************/
.factory('ArticleFactory',function($rootScope,$q,$http,ENV){
    
    var catid,page,
        url = ENV.apiUrl2;
        
    return {
        //后端数据查询接口。catid栏目分类；p参数上拉或下拉；doRefresh：页面刷新、下拉刷新；loadMore：上拉加载。
        query: function(catid,p) {
            if(p=="loadMore"){      //判断是否是上拉加载
                page += 1;
            }else{
                page =1;
            }
            var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
            $http({    //主要配置
                method: 'get', 
                params: {
                    a:'articleList',
                    catid: catid,
                    page: page
                },
                url: url,
                cache: true
            })
            .success(function(data, status, headers, config) {
                deferred.resolve(data);  // 声明执行成功，即http请求数据成功，可以返回数据了
            })
            .error(function(data, status, headers, config) {
                deferred.reject(data);   // 声明执行失败，即服务器返回错误
            });
            return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
        }
        
    };  
    
})
controller里
//发起数据调用，依据p参数判断下拉刷新还是上拉加载。
        function articlePromiseApi(catid,p){
            ArticleFactory.query(catid,p)
            .then(function(data) {
                if (data.length < 10) {         //判断是否有下一页数据，data不足一个页面，阻止上拉加载。
                    ngif = false;
                }
                if(p=="loadMore"){          //上拉加载
                    $rootScope.articleList = $rootScope.articleList.concat(data);
                }else{                              //下拉刷新，重置ngif
                    $rootScope.articleList = data;  /-repeat循环数据datas
                    ngif = true;
                }
                //console.log($rootScope.articleList);
                if($scope.showloading){$scope.showloading=false;}
            }, function(data) {
                alert('fail');
            });
        }
 
AngularJS 使用 localStorage 存储数据。

angular.module('starter.mainFactory', [])
.factory('locals',locals) ;
locals.$inject = ['$window'];
function locals($window){
  return{
    //存储单个属性
    set :function(key,value){
      $window.localStorage[key]=value;
    },
    //读取单个属性
    get:function(key,defaultValue){
      return  $window.localStorage[key] || defaultValue;
    },
    //存储对象，以JSON格式存储
    setObject:function(key,value){
      $window.localStorage[key]=JSON.stringify(value);
    },
    //读取对象
    getObject: function (key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    //删除某一键值对
    removeItem:function(key){
      return $window.localStorage.removeItem(key);
    },
    //清空整个localStorage
    clearLocalStorage:function(){
      return $window.localStorage.clear();
    }

  };
}

$scope.doLogin = function(u) {
        if(u ==undefined || u.username==undefined || u.password==undefined){
          var alertPopup = $ionicPopup.alert({title: '消息', template: '帐号与密码不能为空~！'});
          return ;
        }
      if(!is_phones(u.username) && !is_mail(u.username)){
        var alertPopup = $ionicPopup.alert({title: '消息', template: '请输入正确的手机号码或邮箱~！'});
        return ;
      }
      //与远程服务通信
      $ionicLoading.show({template: '<ion-spinner icon="lines" class="spinner-calm l"></ion-spinner><span class="loadingtxt">载入中...</span>',duration:60000 });
      var username=u.username;
      var password=u.password;
      var urldata='username='+username+'&pwd='+password;//构造传数据
      var encode=UrlEncode(urldata);
      var postdata=urldata+encode;
      var url = APIURL+'Index-App-newlogin.html';       //新版本登陆接口
        $http.post(url,postdata,{})
          .success(function(data){
              $ionicLoading.hide();
            if(data.status==1){
              var wsCache = new WebStorageCache();
              wsCache.set('username', u.username);   //保存用户登录名
              wsCache.set('userinfo', data.userinfo);   //保存会员信息
              wsCache.set('config', data.config);   //保存配置
              wsCache.set('user_id', data.user_id);  //保存用户ID
              wsCache.set('shopserviceswitch','');        //商家救援数据
              wsCache.set('rescuecount','');        //救援数据
              wsCache.set('servicecount','');      //服务数据
              wsCache.set('fundcount','');          //退款数据
              wsCache.set('ordercount','');           //订单数据

              if(data.post_rescue==1){ wsCache.set('rescueswitch',1);} else{wsCache.set('rescueswitch',0);} //救援开关
              if(data.post_doorservice==1){ wsCache.set('serviceswitch',1);}else{ wsCache.set('serviceswitch',0);}//服务开关
              if(data.post_rescue_business==1){ wsCache.set('shopserviceswitch',1);}else{ wsCache.set('shopserviceswitch',0);}//商家救援开关

              $state.transitionTo("tab.indexs");
              return;
            }else{
              var alertPopup = $ionicPopup.alert({title: '警告消息', template:data.error});
              return ;
            }
          }).error(function(e){
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({title: '警告消息', template: '与远程服务器通信错误，请稍后再试~！'});
            return ;
          });
    };
杭州-又丑又穷  16:21:23
WebStorageCache 插件
这个很方便set保存数据到本地,get获取数据
在app.js里面要配置路由
 
$scope.doLogin = function(u) {   参数 user  表单


<ion-view hide-nav-bar = "true" class="loginbody">
  <ion-content overflow-scroll="true" style="overflow: hidden" >
    <form ng-submit="doLogin(loginData)" novalidate="novalidate">
      <div class="list list-inset loginlist">
        <label class="item item-input">
          <i class="icon ion-person placeholder-icon"></i>
          <input type="text" ng-model="loginData.username"  placeholder="请输入手机号码或邮箱登录">
        </label>
        <label class="item item-input">
          <i class="icon ion-locked placeholder-icon"></i>
          <input type="password" ng-model="loginData.password">
        </label>
        <label class="item">
          <button class="button button-block button-positive" type="submit">登陆</button>
        </label>
      </div>
      <div class="extendlogin buttionhref-calm" >
        <a ng-click="jumpPost('smslogin',loginData.username)" class="r">短信登陆</a>
        <a ng-click="jumpPost('userpassword',loginData.username)">忘记密码?</a>
      </div>
      <div class="extendlogin buttionhref-calm" >
        <a ng-click="ontrial('trialshop')" class="r">免费试用</a>
      </div>

    </form>
</ion-content>
</ion-view>

 
下一步(验证用户收到的验证码是否正确,然后跳到下一页面)
验证用户收到的验证码是否正确,然后跳到下一页面 或者完善个人信息（第一次进来的时候），完善了就注册完成了
 
少  16:37:19
三个控制器来完成？
杭州-又丑又穷  16:37:40
也可以用一个控制器,其它二个页面用弹窗
少  16:37:56
ion-modal-view?
杭州-又丑又穷  16:38:22
我先看一下,好久没做了,别搞错了
少  16:39:23
controller('loginCtrl', function($scope) {
     $scope.sendCode=function(){}
}).controller('loginCodeCtrl', function($scope) {
     $scope.validateCode=function(){}
}).controller('loginInfoCtrl', function($scope) {
     
});
杭州-又丑又穷  16:39:34
        //====================选择品牌开始================//
        $ionicModal.fromTemplateUrl('templates/modal/modalBrandName.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modalbrandnames = modal;
        });
        $scope.modalBrandSearchShow = function() {      //单条弹出
            var new_brand_tmp=brand_tmp.replace(/([.\s\S]{1})(?:\1+)/g,'$1');//去重复
            //var new_brand_tmp=brand_tmp.replace('[object Object]',"");      //替换字符串

            $scope.sorted_users = all_brand;
            //Click letter event
            $scope.gotoList = function(id){
                $location.hash(id);
                $ionicScrollDelegate.anchorScroll();
            }

            $scope.alphabet = iterateAlphabet();
            //Create alphabet object
            function iterateAlphabet()
            {
                var str = new_brand_tmp;
                var numbers = new Array();
                for(var i=0; i<str.length; i++)
                {
                    var nextChar = str.charAt(i);
                    numbers.push(nextChar);
                }
                return numbers;
            }

            $scope.obtain=function(v,a){
                $scope.goodsinfoss.brand_id=v;
                $scope.goodsinfoss.brand_name=a;
                $scope.modalBrandSearchClose();
            }
            //结束
            $scope.modalbrandnames.show();
        };
        $scope.modalBrandSearchClose=function(){     //单条关闭
            $scope.modalbrandnames.hide();
            $ionicScrollDelegate.scrollTop();
        }
 $ionicModal.fromTemplateUrl 初始化弹窗
 $scope.modalBrandSearchShow 打开弹窗
 $scope.modalBrandSearchClose 关闭弹窗



return $this->respondWithSuccess([
                'token' => JWTAuth::fromUser($user),
                'expiryTime' => (string)(Carbon::now()->timestamp + config('jwt.ttl') * 60),
                'id' => $user->id,
                'nickname' => $user->nickname,
                'avatar' => substr($user->avatar, 0, 4) == 'http' ? $user->avatar : url($user->avatar),
                'mobile' => $user->mobile,
                'sex' => $user->sex,
                'mobileBinding' => $user->mobile_binding,
                'registerTime' => (string)$user->created_at->timestamp,
                'lastLoginTime' => (string)$user->last_login_time->timestamp,
            ], '登录成功');



就是请求发出去之前或请求响应时可以先拦截下来做一些处理   比如加一些头部啊，做一些错误处理啊什么的 ，
 .factory('httpInterceptor', ['$q','$injector','$log','$cookies',function ($q,$injector,$log,$cookies) {
            return {
                'request':function(config){//请求发出去之前
                    if(window.localStorage[cache.logined]=="true"){
                        $http.defaults.headers.common.Authorization = 'Bearer '+window.localStorage[cache.token];
                    }else{
                        $http.defaults.headers.common.Authorization = '';
                    }
                    return config;
                },
                'response':function(response){//服务器响应时
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
                }
            };
        }])
 showMsg
你看不懂的就是我自己定义的方法
用的时候要在module config里面加   $httpProvider.interceptors.push('httpInterceptor');
【小兵】Jerry(48199539) 2016/9/27 17:12:33
token 么 默认加载 headers  里面就行了
【连长】。(252352801) 2016/9/27 17:13:04
方法有很多  看你喜好了


$scope.$on('$ionicView.loaded', function() {
  console.log("$ionicView.loaded");
});
$scope.$on('$ionicView.beforeEnter', function() {
  console.log("$ionicView.beforeEnter");
});
$scope.$on("$ionicView.enter", function() {
  console.log("$ionicView.enter");
});
$scope.$on('$ionicView.afterEnter', function() {
  console.log("$ionicView.afterEnter");
});

$scope.$on('$ionicView.beforeLeave', function() {
  console.log("$ionicView.beforeLeave");
});
$scope.$on('$ionicView.leave', function() {
  console.log("$ionicView.leave");
});
$scope.$on('$ionicView.afterLeave', function() {
  console.log("$ionicView.afterLeave");
});
$scope.$on('$ionicView.unloaded', function() {
  console.log("$ionicView.unloaded");
});

<!--MOB SHARE BEGIN-->
<div class="-mob-share-ui-button -mob-share-open">分享</div>
<div class="-mob-share-ui" style="display: none">
    <ul class="-mob-share-list">
        <li class="-mob-share-weibo"><p>新浪微博</p></li>
        <li class="-mob-share-tencentweibo"><p>腾讯微博</p></li>
        <li class="-mob-share-qzone"><p>QQ空间</p></li>
        <li class="-mob-share-qq"><p>QQ好友</p></li>
        <li class="-mob-share-weixin"><p>微信</p></li>
        <li class="-mob-share-douban"><p>豆瓣</p></li>
        <li class="-mob-share-renren"><p>人人网</p></li>
        <li class="-mob-share-kaixin"><p>开心网</p></li>
        <li class="-mob-share-facebook"><p>Facebook</p></li>
        <li class="-mob-share-twitter"><p>Twitter</p></li>
    </ul>
    <div class="-mob-share-close">取消</div>
</div>
<div class="-mob-share-ui-bg"></div>
<script id="-mob-share" src="http://f1.webshare.mob.com/code/mob-share.js?appkey=1797b4778c086"></script>
<!--MOB SHARE END-->


梦里都是你的柔情似水  17:46:18
1、安装插件，运行命令 cordova-hcp build，配置好WWW目录下的chcp.json
2、修改配置文件config.xml 加上config-file url="http://www.abc.com/www/chcp.json"
3、打包 安装
4、修改本地WWW文件  运行命令cordova-hcp build    改了chcp.json文件，所以要再次修改url   
5、复制WWW目录到服务器www.abc.com/下面
6、重启APP两次
少  17:46:25
1.改URL服务器地址，2.上传www.3,打包安装(这里的配置就有服务器的config url)
好的，谢谢了
就是通过config url里面的东西来判断对比 
少  17:47:38
cordova-hcp build 只运行一次就可以了吧
梦里都是你的柔情似水  17:47:53
初始化运行一次  修改以后运行一次
少  17:48:18
我明白了，感谢你了

cordova-hcp build 这里，可以换成ionic build吗
梦里都是你的柔情似水  17:48:46
没试过
 //{status: "error", code: 404, message: "昵称还没有设置"}
                //{status: "success", code: 200, message: "登录成功",result:{}}
                //{status: "error", code: 403, message: "登录失败, 登录验证码错误"}
            
                    //window.localStorage[cache.logined]="true";
                    //window.localStorage[cache.token]=resp.result.token;
                    //window.localStorage[cache.userId]=resp.result.id;
                    //                    
                    // {status: "success", code: 200, message: "注册成功", 
                    // result: {token: "eyJ0eXPwOY", expiryTime: "1474518492", 
                    // id: 6} }
