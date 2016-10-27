var settings = {
    client_id: '122440',
    client_secret: '576ec4d35f1b59363ef51171bc95421a',
    rows: 10
}

// var wsCache = new WebStorageCache();
// var curToken =  wsCache.get("myToken");
// var curID =  wsCache.get("myID"); 
var hostName = "http://api.enclavemedia.cn/api/";
var urls = {
    getArticles: hostName+"index",   //文章列表页
    getArticleDetail: hostName+"index/article/?art_id=",   //文章详情
    sendCode: hostName+"send?phone=", //发送验证码
    login: hostName+"login",  //登录
    setUserInfo: hostName+"setUserInformation",  //设置用户信息
    getUserInfo: hostName+"getSelfUserInformation", //请求用户信息
    updateUserInfo: hostName+"updateSelfUserInformation", //更新用户信息
    updateUserAvatar: hostName+"updateUserAvatar", //上传用户头像    user_id avatar  post
    getOtherUserInfo: hostName+"getOtherUserInfomation", //获取他人信息
    likeAddDel: hostName+"addOrCancelLikeRecord", //评论点赞
    pubComment: hostName+"postComment", //文章评论
    getComment: hostName+"getCommentList", //获取文章评论列表
    getMessage: hostName+"getMessageList", //获取会员评论列表
    getSelfComment: hostName+"getCommentBySelf", //获取会员评论列表
    favList: hostName+"getCollectionList", //获取收藏列表
    favAddDel: hostName+"addOrCancelCollectArticleInfo", //文章收藏
    //unRead: hostName+"addOrCancelLikeRecord", //获取未读信息列表
    imgUrl: "http://api.enclavemedia.cn/"
}

var wsCache = new WebStorageCache();
var DELEY = 300;//验证码发送间隔时间

var cache = {
    user: "_user",
    userId: "user_id",
    token: '_token',
    logined:'logined',
    sendCodeTime:'sendCodeTime',
    smsId:"smsId"
};
var articleCache ={
    list:"_artList"
};
var curUser={
     avatar:"data:image/png;base64,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"
};

var removeInfo = function(){
    window.localStorage[cache.logined] = "false";
    window.localStorage.removeItem(cache.user);
    window.localStorage.removeItem(cache.token);
    window.localStorage.removeItem(cache.userId);
    window.localStorage.removeItem(cache.sendCodeTime);
    window.localStorage.removeItem(cache.smsId);
}

var mediaOption={  
            flashplayer: 'js/player.swf',  
            file:'',  
            width: 375,  
            height:281,  
            image: '',
            dock: false
        };


