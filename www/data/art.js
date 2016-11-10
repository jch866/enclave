<<<<<<< HEAD
var data = {
    //专题查询
    "status": "success",
    "code": 200,
    "message": "查询分类列表成功",
    "result": {
        "pageInfo": {
            "total": 11,
            "currentPage": 1
        },
        "categories": {
            "total": 11,
            "per_page": 5,
            "current_page": 1,
            "last_page": 3,
            "next_page_url": "http://api.enclavemedia.cn/api/getCategory?page=2",
            "prev_page_url": null,
            "from": 1,
            "to": 5,
            "data": [
                {
                    "cate_id": 1,
                    "cate_name": "一首诗",
                    "cate_title": "",
                    "cate_keywords": "",
                    "cate_description": "",
                    "cate-view": "0",
                    "cate_order": "0",
                    "cate_pid": "0",
                    "cate_thumb": "uploads/20161026113819497.jpg"
                },
                {
                    "cate_id": 2,
                    "cate_name": "档案馆",
                    "cate_title": "",
                    "cate_keywords": "",
                    "cate_description": "",
                    "cate-view": "0",
                    "cate_order": "0",
                    "cate_pid": "0",
                    "cate_thumb": "uploads/20161026113842763.jpg"
                },
                {
                    "cate_id": 3,
                    "cate_name": "青年写作者计划",
                    "cate_title": "",
                    "cate_keywords": "",
                    "cate_description": "",
                    "cate-view": "0",
                    "cate_order": "0",
                    "cate_pid": "0",
                    "cate_thumb": "uploads/20161026113859520.jpg"
                },
                {
                    "cate_id": 4,
                    "cate_name": "青年生活随笔",
                    "cate_title": "",
                    "cate_keywords": "",
                    "cate_description": "",
                    "cate-view": "0",
                    "cate_order": "0",
                    "cate_pid": "0",
                    "cate_thumb": "uploads/20161026113919863.jpg"
                },
                {
                    "cate_id": 5,
                    "cate_name": "视野",
                    "cate_title": "",
                    "cate_keywords": "",
                    "cate_description": "",
                    "cate-view": "0",
                    "cate_order": "0",
                    "cate_pid": "0",
                    "cate_thumb": "uploads/20161026113939907.jpg"
                }
            ]
        }
    }
}


=======
>>>>>>> c6d83150e1a52116fe780887acc9eff41ccac631
var addOrCancelLikeRecord.resp = {
    "status": "success",
    "code": 200,
    "message": "点赞成功",
    "result": {
        "type": "add",
        "count": 1
    }
}

var addOrCancelLikeRecord.resp = {
    "status": "success",
    "code": 200,
    "message": "取消赞成功",
    "result": {
        "type": "cancel",
        "count": 0
    }
}



var commentlist = {
    "status": "success",
    "code": 200,
    "message": "获取评论列表成功",
    "result": {
        "pageInfo": {
            "total": 2,
            "currentPage": 1
        },
        "data": [{
            "byUser": {
                "id": 4,
                "nickname": "了了了了了",
                "avatar": "http://api.enclavemedia.cn/uploads/user/avatar/d0835054529e5abc7135a82888c96359.png",
                "sex": "0"
            },
            "toUser": {
                "id": 3,
                "nickname": "绝世二哥",
                "avatar": "http://api.enclavemedia.cn/uploads/user/avatar/12083b8af442bd0b461ebf332e8c8862.png",
                "sex": "0"
            },
            "id": 2,
            "messageType": "comment",
            "type": "article",
            "sourceId": "37",
            "content": "你这",
            "looked": "0",
            "publishTime": "1476782995",
            "sourceTitle": "测试文章11",
            "sourceEditor": "飞地"
        }, {
            "byUser": {
                "id": 4,
                "nickname": "了了了了了",
                "avatar": "http://api.enclavemedia.cn/uploads/user/avatar/d0835054529e5abc7135a82888c96359.png",
                "sex": "0"
            },
            "toUser": {
                "id": 3,
                "nickname": "绝世二哥",
                "avatar": "http://api.enclavemedia.cn/uploads/user/avatar/12083b8af442bd0b461ebf332e8c8862.png",
                "sex": "0"
            },
            "id": 1,
            "messageType": "comment",
            "type": "article",
            "sourceId": "37",
            "content": "iOS 10",
            "looked": "0",
            "publishTime": "1476782986",
            "sourceTitle": "测试文章11",
            "sourceEditor": "飞地"
        }]
    }
}



var favList = {
    "status": "error",
    "code": 404,
    "message": "没有任何收藏数据"
} {
    "status": "success",
    "code": 200,
    "message": "取消收藏文章信息成功",
    "result": {
        "type": "cancel"
    }
} {
    "status": "success",
    "code": 200,
    "message": "收藏文章信息成功",
    "result": {
        "type": "add"
    }
}
var myfav = {
    "status": "success",
    "code": 200,
    "message": "查询收藏列表成功",
    "result": {
        "pageInfo": {
            "total": 2,
            "currentPage": 1
        },
        "data": {
            "0": {
                "art_id": 37,
                "art_title": "测试文章11",
                "art_editor": "飞地",
                "art_thumb": "http://api.enclavemedia.cn/uploads/20161012115154389.jpg",
                "view": "257"
            },
            "1": {
                "art_id": 36,
                "art_title": "测试文章10",
                "art_editor": "飞地",
                "art_thumb": "http://api.enclavemedia.cn/uploads/20161012115135857.jpg",
                "view": "54"
            },
            "commentCount": 0,
            "collectionCount": 0
        }
    }
}

<<<<<<< HEAD
var data = { status: "error", code: 404, message: "没有获取到任何数据" } { status: "error", code: 4003, message: "user不存在" }


var myApp = angular.module('appCtrl', []);
myApp.controller('fileCtrl', function ($scope,$cordovaFile) {
    //http://ngcordova.com/docs/plugins/file
    $cordovaFile.getFreeDiskSpace()
      .then(function (success) {
         // success in kilobytes
      }, function (error) {
          // error
      });
})
=======
{ status: "error", code: 404, message: "没有获取到任何数据" } { status: "error", code: 4003, message: "user不存在" }
>>>>>>> c6d83150e1a52116fe780887acc9eff41ccac631
