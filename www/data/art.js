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
    "status":"error",
    "code":404,
    "message":"没有任何收藏数据"
}
{
    "status":"success",
    "code":200,
    "message":"取消收藏文章信息成功",
    "result":{
        "type":"cancel"
    }
}
{
    "status": "success",
    "code": 200,
    "message": "收藏文章信息成功",
    "result": {
        "type": "add"
    }
}
var myfav = {
    "status":"success",
    "code":200,
    "message":"查询收藏列表成功",
    "result":{
        "pageInfo":{
            "total":2,
            "currentPage":1
        },
        "data":{
            "0":{
                "art_id":37,
                "art_title":"测试文章11",
                "art_editor":"飞地",
                "art_thumb":"http://api.enclavemedia.cn/uploads/20161012115154389.jpg",
                "view":"257"
            },
            "1":{
                "art_id":36,
                "art_title":"测试文章10",
                "art_editor":"飞地",
                "art_thumb":"http://api.enclavemedia.cn/uploads/20161012115135857.jpg",
                "view":"54"
            },
            "commentCount":0,
            "collectionCount":0
        }
    }
}