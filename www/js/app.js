var enclaveApp = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.filter','ngCordova']);
enclaveApp.run(function($ionicPlatform,$cordovaNetwork, $rootScope) {
    // if(window.localStorage[cache.token]){
    //     $http.defaults.headers.common.Authorization = 'Bearer '+window.localStorage[cache.token];
    // }
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});

enclaveApp.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider,$httpProvider) {

    //添加拦截器
    $httpProvider.interceptors.push('httpInterceptor');

    $ionicConfigProvider.backButton.text("");
    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('standard');
    $ionicConfigProvider.platform.ios.navBar.alignTitle("center")
    $ionicConfigProvider.platform.android.navBar.alignTitle("center")
    $stateProvider
    .state('home', {
        url: '/home',
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
    })
    .state('article', {
        url: '/article/:art_id',
        //params:{'data':null},
        templateUrl: 'templates/articleDetail.html',
        controller: 'articleDetailCtrl'
    }).state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
    }).state('loginCode', {
        url: '/loginCode/:phone',
        templateUrl: 'templates/login_code.html',
        controller: 'loginCodeCtrl'
    }).state('loginComplete', {
        url: '/loginComplete',
        templateUrl: 'templates/login_complete.html',
        controller: 'loginCompleteCtrl'
    }).state('usercenter', {
        url: '/usercenter',
        templateUrl: 'templates/userCenter.html',
        controller: 'usercenterCtrl'
    }).state('setting', { //设置
        url: '/setting',
        templateUrl: 'templates/setting.html',
        controller: 'settingCtrl'
    }).state('message', { //消息
        url: '/message',
        templateUrl: 'templates/message.html',
        controller: 'messageCtrl'
    }).state('comment_pub', { //评论 发布
        url: '/comment_pub',
        params:{'data':null},
        templateUrl: 'templates/comment_pub.html',
        controller: 'pubCommentCtrl'
    }).state('comment_reply', { //评论 回复
        url: '/comment_reply',
        params:{'data':null},
        templateUrl: 'templates/comment_reply.html',
        controller: 'replyCommentCtrl'
    }).state('comment', { //个人评论列表
        url: '/comment',
        templateUrl: 'templates/comment.html',
        controller: 'commentListCtrl'
    }).state('favourite', { //收藏
        url: '/favourite',
        templateUrl: 'templates/favourite.html',
        controller: 'favListCtrl'
    });
    $urlRouterProvider.otherwise('/home');
});

// .state('tab.home', {
//         url: '/home',
//         views: {
//             'tab-home': {
//                 templateUrl: 'templates/tab-home.html',
//                 controller: 'homeCtrl'
//             }
//         }
//     })
//     .state('tab.findmore', {
    //     url: '/findmore',
    //     views: {
    //         'tab-findmore': {
    //             templateUrl: 'templates/tab-findmore.html',
    //             controller: 'findMoreCtrl'
    //         }
    //     }
    // })
// app.controller('myCtrl', ['$scope','$location','$anchorScroll', function ($scope,$location,$anchorScroll) {
//     if($location.path()=='/tab/home'){
//          $('.tab-nav.tabs').removeClass("yincang");
//          showConfirm();
//     }else if($location.path()=='/tab/catagory'){
//          $state.go("tab.home");
//     }else if($location.path()=='/tab/home'){
//         $state.go("tab.user");
//     }else if($location.path()=='/tab/home'){
//         $state.go("tab.orderlist");
//     }else if($location.path()=='/tab/home'){
//         $state.go("tab.home");
//     }else if($location.path()=='http://192.168.0.230/pay/'){
//         $state.go("tab.home");
//     }else if($ionicHistory.backView()){
//         $ionicHistory.goBack();
//     }
// }])

// refreshing-text="刷新中"
// ng-href="#/tab/detail/{{route.tripID}}"
// 
// enclaveApp.directive('onRenderFinish', function ($timeout) {
//     return {
//         restrict: 'A',
//         link: function (scope, element, attr) {
//           //  if (scope.$last === true) {
//                 console.log("111111111111");
//                 console.log(scope);
//                 $timeout(function () {
//                     scope.$emit('onRenderFinished'); //事件通知
//                         // var fun = $scope.$eval(attrs.onFinishRender);
//                         // if(fun && typeof(fun)=='function'){  
//                         //     fun();  //回调函数
//                         // }  
//                 });
//            // }
//         }
//     };
// })

// enclaveApp.directive('onRenderFinish',[function(){  
//         return {  
//             restrict:'A',  
//             link:function ($scope, element, attrs, controller) {  
//                 console.log("my directive");
//                 var fun = $scope.$eval(attrs.OnReanderFinsh);//计算表达式的值  
//                 if(fun && typeof(fun)=='function'){  
//                     fun();  
//                 }  
//             }  
//         };  
//     }]); 