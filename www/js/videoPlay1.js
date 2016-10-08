    jwplayer.key="0SIqZ6qZs+T0/lLkD+ISn/8JHaWniRyb1hu0cg==";


    var thePlayer;  //保存当前播放器以便操作  
    $(function() {  
        var playCon = $(".articlePic");
        //var playId = playCon.children().attr("id");
    // if(playCon.children()[0].nodeName.toUpperCase()=="DIV"){
        //if(playId){


        thePlayer = jwplayer("art_media").setup({  //mediaOption/*
            flashplayer: 'js/player.swf',  
            file: 'media/play.mp4',  
            width: 500,  
            height: 350,  
            image: 'img/ben.png',
            dock: false,
            // skin: {
            //       name: "eight", 
            //       //Seven | Six | Five | Glow | Beelden | Vapor | Bekle | Roundster | Stormtrooper
            //       // active: "red",
            //       // inactive: "white",
            //       // background: "green"
            //       }
            //file: 'media/txjg.mp3',  
            //  playlist: [
            //     {duration:32,file:"media/play1.mp4",image:"img/ben.png"},
            //     {duration:124,file:"media/play2.mp4",image:"img/adam.jpg"},
            //     {duration:542,file:"media/play3.mp4",image:"/uploads/ed.jpg"}
            // ],
            // "playlist.position":"right",
            // "playlist.size":360,
        }
        );  
        //声音调节事件  
        // thePlayer.on('volume', function(e) {
        //     var sound = e.volume;
        //     sound>80&&console.log("Volume is changed to: "+ e.volume);  
        // });
        // 播放完成事件
            thePlayer.on('complete', function(){
                console.log("Complete fired - Your content has completed!");
            });
        //播放 暂停  
        $('.player-play').click(function() {  
            if (thePlayer.getState().toUpperCase() != 'PLAYING') {  
                thePlayer.play(true);  
                this.value = '暂停';  
            } else {  
                thePlayer.play(false);  
                this.value = '播放';  
            }  
        });  
        //停止  
        $('.player-stop').click(function() { thePlayer.stop(); });  
        //获取状态  
        $('.player-status').click(function() {  
            var state = thePlayer.getState().toUpperCase();  
            var msg;  
            switch (state) {  
                case 'BUFFERING':  
                    msg = '加载中';  
                    break;  
                case 'PLAYING':  
                    msg = '正在播放';  
                    break;  
                case 'PAUSED':  
                    msg = '暂停';  
                    break;  
                // case 'IDLE':  
                //     msg = '停止';  
                //     break;   
                case 'COMPLETE':  
                    msg = '播放完毕';  
                    break;  
            }  
            alert(msg);  
        });  
        //获取播放进度  
        $('.player-current').click(function() { alert(thePlayer.getPosition()); });  
        //跳转到指定位置播放  
        $('.player-goto').click(function() {  
            if (thePlayer.getState().toUpperCase() != 'PLAYING') {    //若当前未播放，先启动播放器  
                thePlayer.play();  
            }  
            thePlayer.seek(30); //从指定位置开始播放(单位：秒)  
        });    
        //获取视频长度  
        $('.player-length').click(function() { alert(thePlayer.getDuration()); });
        //}    
    // }else{
    //     return;
    // }
    });  
 

 //       var thePlayer;  //保存当前播放器以便操作 
 //        $(function() { 
 //            thePlayer = jwplayer('container').setup({ 
 //                flashplayer: 'js/jwplayer.flash.swf', 
 //                //file: '${basePath}/resources/jwplayer/video.mp4', 
 //                playlist: [
 //                  //{ duration: 32, file: "/uploads/video.mp4", image: "/uploads/video.jpg" },
 //                  //{ duration: 124, file: "/uploads/bbb.mp4", image: "/uploads/bbb.jpg" },
 //                  //{ duration: 542, file: "/uploads/ed.mp4", image: "/uploads/ed.jpg" }
 //                  <#list cacheVEDs as cVED>
 //                     {  file: '${basePath}/${tempDir}/${cVED.localFilePath}', title:'${cVED.localFilePath}' },
 //                  </#list>
 //              ],
 //              "playlist.position": "right",
 //              "playlist.size": 100,
 //                width: 600, 
 //                height: 350, 
 //                dock: false 
 //            }); 
