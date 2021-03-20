;(function($){
  //定义一个jquery闭包
    // 定义轮播图对象的构造函数
   var  Carousel = function(poster){
         var  self = this;//防止this冲突，保存到中间变量self
       //找到轮播图所在的div对象
         this.poster = poster;//poster是jquery对象
       //找到轮播图的四个组成部分
       //1.朝左的按钮
       this.prevBtn = poster.find("div.poster-prev-btn");
       //2.找朝右的按钮
       this.nextBtn = poster.find("div.poster-next-btn");
       //3.找图片所在的列表
       this.posterUl= poster.find("ul.poster-list");
       //4.找到所有的图片项
       this.posterItems = poster.find("li.poster-item");
       //如果图片数量是偶数项，那么不会形成对称效果，所以需要人为的复制一项放在最后
       if(this.posterItems.size()%2===0)
       {
              //复制第一项并添加到ul中显示
           this.posterUl.append(this.posterItems.eq(0).clone());
           this.posterItems = this.posterUl.children();
       }
       //由于需要做循环轮播，所以要记录下首尾项
       this.posterFirstItem = this.posterItems.first();
       this.posterlastItem = this.posterItems.last();

       //默认配置参数
       this.setting={
           "width" :1000,//轮播图的整体宽度
           "height": 350,//轮播图的整体高度
           "posterWidth":640,//轮播图突出显示的图片宽度
           "posterHeight":300,//突出显示的图片高度
           "scale":0.8,//不同等级图片的缩放比例  最高级是1
           "speed":500,//轮播图滚动的动画持续时间
           "autoPlay":false,//轮播图是否自动播放
           "delay":1000, //滚动的时间间隔
           "verticalAlign":"middle" //图片排列时垂直方向的对齐方式
                                    // middle  top  bottom
       }

       //读取用户的自定义参数
       $.extend(this.setting,this.getSetting());
       // 设置配置参数
       this.setSettingValue();
       //初始化除了第一张图片以外的其余图片的位置
       this.setPosterPos();

       //点击下一张按钮，那么轮播图朝左滚动
       this.nextBtn.click(function(){
            //滚动图片 朝左
           self.carouselRotate("left");
       });
       //点击上一张按钮，那么轮播图朝右滚动
       this.prevBtn.click(function(){
           //滚动图片 朝右
           self.carouselRotate("right");
       });

       //是否开启自动轮播
       if(this.setting.autoPlay)
       {
            this.autoPlay();
            //鼠标悬停时，让轮播暂停
           this.poster.hover(function(){
                window.clearInterval(self.timer);
           },function(){
               //悬停取消时，恢复自动播放
                self.autoPlay();
           })

       }
   };

   Carousel.prototype={

       //自动轮播
       autoPlay:function(){
           var self = this;
          this.timer = window.setInterval(function(){
              //换下一张图片
              self.nextBtn.click();
          },this.setting.delay);
       },

       //滚动轮播图的函数，可以设定滚动方向
        carouselRotate:function(dir){
           var  _this_ = this;
           //看滚动方向
            if(dir ==="left")
            {
                this.posterItems.each(function(){
                    //将前一张图片的 相关属性复制给后一张图片
                    var self =    $(this);//获得当前的图片项
                    //所以要获取当前图片的前一张图片
                    //由于首尾相连 那么第一张图片的前一张图片就是队列的最后一张图片
                    var prev = self.prev().get(0)?self.prev():
                          _this_.posterlastItem;
                    //取到前一张图片的相关样式
                    var width = prev.width(),
                        height=prev.height(),
                        opactiy = prev.css("opacity"),
                        left = prev.css("left"),
                        top = prev.css("top"),
                        zIndex = prev.css("zIndex");
                    //通过动画，将当前图片项的属性修改为前一张图片的属性
                    self.animate({
                        width: width,
                        height:height,
                        opacity:opactiy,
                        left: left,
                        top:top,
                        zIndex:zIndex
                    },_this_.setting.speed);
                })
            }else if(dir==="right")
            {
                this.posterItems.each(function(){
                    //将后一张图片的 相关属性复制给前一张图片
                    var self =    $(this);//获得当前的图片项
                    //所以要获取当前图片的后一张图片
                    //由于首尾相连 那么第一张图片的前一张图片就是队列的最后一张图片
                    var next = self.next().get(0)?self.next():
                        _this_.posterFirstItem;
                    //取到前一张图片的相关样式
                    var width = next.width(),
                        height=next.height(),
                        opactiy = next.css("opacity"),
                        left = next.css("left"),
                        top = next.css("top"),
                        zIndex = next.css("zIndex");
                    //通过动画，将当前图片项的属性修改为前一张图片的属性
                    self.animate({
                        width: width,
                        height:height,
                        opacity:opactiy,
                        left: left,
                        top:top,
                        zIndex:zIndex
                    },_this_.setting.speed);
                })
            }

        },
       //设置配置参数，设定轮播图的基本尺寸，窗口大小 等属性
       setSettingValue:function(){
           //设置轮播图的整体大小
           this.poster.css({
               width:this.setting.width,
               height:this.setting.height
           })

           //设置图片列表框的宽度大小和轮播国div的大小一致
           this.posterUl.css({
               width:this.setting.width,
               height:this.setting.height
           })
           //计算切换按钮的宽度
           var w = (this.setting.width- this.setting.posterWidth)/2;
           //设置左右两个按钮的位置
           this.nextBtn.css({
               width:w,
               height:this.setting.height,
               zIndex:Math.ceil(this.posterItems.size()/2)+1
           })
           this.prevBtn.css({
               width:w,
               height:this.setting.height,
               zIndex:Math.ceil(this.posterItems.size()/2)+1
           })
           //设置第一张图片的显示
           this.posterFirstItem.css({
               width:this.setting.posterWidth,
               height:this.setting.posterHeight,
               left:w,
                top:0,
               zIndex:Math.ceil(this.posterItems.size()/2)
           })

       },
       //设置所有图片帧的位置
       setPosterPos:function(){
           var  self = this,
           //获得除了第一张以外的所有图片帧
           sliceItems =  this.posterItems.slice(1),
           //对称放置时 每边的张数
               sliceSize = sliceItems.size()/2,
               //放置在右面的图片
               rightSlice= sliceItems.slice(0,sliceSize),
               //放置在左边的图片
               leftSlice=sliceItems.slice(sliceSize),
           //求出一共多少个等级
           level = Math.floor(this.posterItems.size()/2);
           //设置右边帧的位置 和宽度 以及 高度top
           var firstLeft  = (this.setting.width - this.setting.posterWidth)/2;
           var rw = this.setting.posterWidth;
           var fixOffsetLeft = firstLeft+rw;
           var rh= this.setting.posterHeight;
           //每个等级的递减量
           var  gap = ((this.setting.width-this.setting.posterWidth)/2)/level;
           //设置右边图片的位置
           rightSlice.each(function(i){
                level--;
                rw = rw*self.setting.scale;
                rh = rh*self.setting.scale;
                var j=i;
                $(this).css({
                    zIndex:level,
                    width:rw,
                    height:rh,
                    left:fixOffsetLeft+(++i)*gap-rw,
                    opacity:1/(++j),
                    //设置垂直排列
                    // top:0
                    top:self.setVerticalAlign(rh)
                })
           });
           //设置左边的位置关系
           var lw =  rightSlice.last().width(),
               lh = rightSlice.last().height(),

               oloop = Math.floor(this.posterItems.size()/2);
           leftSlice.each(function(i){
                 $(this).css({
                     zIndex:i,
                     width:lw,
                     height:lh,
                     left:i*gap,
                     opacity:1/oloop,
                     top:self.setVerticalAlign(lh)
                 });
                 lw = lw/self.setting.scale;
                 lh = lh/self.setting.scale;
                 oloop--;

           });

       },

       //设置垂直方向的偏移量
       setVerticalAlign:function(height){
          var verticalType = this.setting.verticalAlign,
              top=0;
          if(verticalType==="middle")
          {
                top = (this.setting.height-height)/2;
          }else if(verticalType ==="top")
          {
              top=0;
          }else if(verticalType==="bottom")
          {
              top = this.setting.height-height;
          }else{
              top = (this.setting.height-height)/2;
          }
          return top;
       },

       //读取自定义参数
       getSetting : function(){
          var setting  = this.poster.attr("data-setting");
          if(setting && setting!="")
          {
              return  $.parseJSON(setting);
          }else{
              return {};
          }
       }
   }

   //给所有设置了pictureSlider样式的div创建出Carousel轮播图对象
   Carousel.init = function(posters){
        var  _this_ = this;
        posters.each(function(){
            //创建轮播图对象
            new _this_($(this));//这个this指代是当前被循环单元的$(div)
        })
   }


   //把Carousel对象暴露给window，使得外界可以直接使用
    //Carousel这个插件
   window["Carousel"]=Carousel;


})(jQuery);