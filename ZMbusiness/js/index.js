/**
 * Created by 滑头鬼 on 2018/1/16.
 */
//显示微信客服二维码弹层
function exampleModa2(){
    $("#exampleModa2").modal("show");
    $("body").css("padding-right","0");
}

//显示微信公众号二维码弹层
function exampleModa3(){
    $("#exampleModa3").modal("show");
    $("body").css("padding-right","0");
}

//页面所有元素加载完成后执行
window.onload = function(){
    //延迟1秒隐藏加载层
    setTimeout(function(){
        $("#mask").hide();
    },1000);
    //初始化wow动画插件
    new WOW().init();
};

//页面DOM结构加载完成后执行
$(function() {
    var timer1;
    var number = 0;
    // 1.清除carouse轮播切换
    $('#carousel-example-generic').carousel({
        interval: false
    });

    // 2.判断页面中用户名和密码框是否聚焦，若没聚焦，启用定时器进行轮播
    var username = $(".login-txt>input[name='username']").is(":focus");
    var pwd = $(".login-txt>input[name='pwd']").is(":focus");
    if (username == false && pwd == false) {
        timer1 = setInterval(changeItem, 4000);
    }

    // 3.给元素绑定自定义事件（朝右滚动）
    $("#carousel-example-generic>a.right").bind("click", function () {
        number++;
        //判断边界
        if (number > 3) {
            number = 0;
        }
        //按钮被点击时，首先清除定时器
        clearInterval(timer1);
        // 4.表单克隆
        formClone();
        // 5.启用定时器，每隔3秒触发自定义事件
        timer1 = setInterval(changeItem, 4000);
    });

    // 3.给元素绑定自定义事件（朝左滚动）
    $("#carousel-example-generic>a.left").bind("click", function () {
        number--;
        //判断边界
        if (number < 0) {
            number = 3;
        }
        //按钮被点击时，首先清除定时器
        clearInterval(timer1);
        // 4.表单克隆
        formClone();
        // 5.启用定时器，每隔3秒触发自定义事件
        timer1 = setInterval(changeItem, 4000);
    });

    // 4.表单克隆
    function formClone() {
        var form = $("#carousel-form").clone(true);
        $("#carousel-form").remove();
        form.appendTo($(".login-info" + number));
    }

    // 5.通过定时器手动触发自定义事件
    function changeItem() {
        $("#carousel-example-generic>a.right").trigger("click");
    }

    // 6.用户名和密码框聚焦,停止定时器
    $(".login-txt>input[name='username']").on("focus",function(){
        clearInterval(timer1);
    });
    $(".login-txt>input[name='pwd']").on("focus",function(){
        clearInterval(timer1);
    });

    //6. 用户名和密码框失焦,重启定时器
    $(".login-txt>input[name='username']").on("blur",function(){
        timer1 = setInterval(changeItem,4000);
    });
    $(".login-txt>input[name='pwd']").on("blur",function(){
        timer1 = setInterval(changeItem,4000);
    });
});



//页面DOM结构加载完成后执行
$(function(){
    $(".hide-box").slideUp();  //初始隐藏层
    //鼠标移入显示层
    $(".back").each(function(){
        var $this = $(this);
        $(this).on("mouseenter",function(){
            $this.removeClass("filter");
            $this.children(".hide-box").stop().slideDown();
            $this.children("img").animate({"margin-top":"-80px"},120,"linear");
        });
    });

    //鼠标移出隐藏层
    $(".back").each(function(){
        var $this = $(this);
        $(this).on("mouseleave",function(){
            $this.addClass("filter");
            $this.children(".hide-box").stop().slideUp();
            $this.children("img").animate({"margin-top":"0"},120,"linear");
        });
    });

    //页面滚动距离超过页面顶部590隐藏导航条
    $(document).on("scroll",function(){
        if($(window).scrollTop()>=590){
            $(".tlayer").css("opacity","1");
            $(".navlist").css("opacity","1");
        }else{
            $(".tlayer").css("opacity","0");
            $(".navlist").css("opacity","0");
        }
    });

    //当导航项单击时更换样式
    $("#navbar-collapse-1 ul li").on("click",function(){
        $("#navbar-collapse-1 ul li").removeClass("active");
        $(this).addClass("active");
    });

    //先获取元素数据临时存放到data中，再重置为0
    $(".scroll-wheel>span").each(function(){
        var $this = $(this);
        $this.data("target",$this.html());
        $this.data("flag",true);
        $this.html(0);
    });
    //窗口滚动时，若标识位为true(即第一次滚动) 且 滚动的距离+窗口高度 大于 当前元素距离页面顶部的距离+90 执行事件
    $(window).on("scroll",function(){
        $(".scroll-wheel>span").each(function() {
            var $this = $(this);
            if ($this.data("flag") && $(window).scrollTop() + $(window).height() >= $(this).offset().top+90) {
                $this.data("flag", false);
                $(this).animate({dummy: 1}, {
                    duration: 2000,
                    speed: 10,
                    step: function (linear) {
                        var val = Math.round($this.data("target") * linear);
                        $this.html(val);
                    }
                });
            }
        });
    });
});
