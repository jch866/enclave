    jwplayer.key = "0SIqZ6qZs+T0/lLkD+ISn/8JHaWniRyb1hu0cg==";


    var thePlayer; //保存当前播放器以便操作  
    $(function() {
        thePlayer = jwplayer("art_media").setup({ //mediaOption/*
            flashplayer: 'js/player.swf',
            file: 'http://source.enclavemedia.cn/%E5%8F%B0%E6%B9%BE%E6%B8%B8%E5%90%9F%E8%AF%97%E4%BA%BA%E5%BC%A0%E5%BF%83%E6%9F%94.2016%E5%A4%8F%E5%AD%A3%E5%B7%A1%E6%BC%94.%E9%A3%9E%E5%9C%B0%E4%B9%A6%E5%B1%80%E7%AB%99-%201080p.mp4',
            width: 500,
            height: 350,
            image: 'img/ben.png',
            dock: false
        });
        // 播放完成事件
        thePlayer.on('complete', function() {
            console.log("Complete fired - Your content has completed!");
        });
    });
