<script setup lang='ts'>
import { reactive, onMounted, ref } from 'vue'
import $ from 'jquery'
let isShow = ref(false)
onMounted(() => {
    var box = $('#new');
    var flag = ref(true);
    var Bg = reactive({
        BgX: 52,
        BgY: 0,
        x: $('#bird').offset().left,
        y: $('#bird').offset().top
    });
    var bird = reactive({
        x: 0
    });
    var num = ref(0);
    // 创建柱子
    let post = (x: any) => {
        var arr = reactive({
            x: null as any,
            topHright: null as any,
            bottHeight: null as any,
        });
        arr.x = x;
        arr.topHright = 150 + Math.ceil(Math.random() * 200);
        arr.bottHeight = $("#container").height() - 150 - arr.topHright;
        var arr1 = $('<div>')
            .css('height', arr.topHright + 'px')
            .css('width', '52px')
            .css('position', 'absolute')
            .css('left', arr.x + 'px')
            .css('background', 'url(http://43.138.70.109:8010/head/pipe2.png) no-repeat center bottom')
            .css('top', '0px');
        $('#container').append(arr1);
        var arr2 = $('<div>')
            .css('width', '52px')
            .css('height', arr.bottHeight + 'px')
            .css('position', 'absolute')
            .css('left', arr.x + 'px')
            .css('background', 'url(http://43.138.70.109:8010/head/pipe1.png) no-repeat')
            .css('top', arr.topHright + 150 + 'px');
        $('#container').append(arr2);
        setInterval(() => {
            if (flag.value) {
                arr.x -= 5;
                arr1.css('left', arr.x + 'px');
                arr2.css('left', arr.x + 'px');
                if (arr.x <= -52) {
                    arr.x = 1450;
                }
                if (arr.x >= 0 && Bg.x >= arr.x + 52) {
                    num.value++;
                    $('#co').html(`${num.value}`);
                    $('#results').html(num.value);
                }
                var top = Bg.x + 30 > arr.x && Bg.x < arr.x + 52 && Bg.y <= arr.topHright;
                var bott = Bg.x + 30 > arr.x && Bg.x < arr.x + 52 && Bg.y + 30 >= arr.topHright + 150;
                if (top || bott) {
                    flag.value = false;
                    $('#mask').css('display', 'block');
                    $('#success').css('display', 'block');
                    $('#co').css('display', 'none');
                    isShow.value = true;
                }
            }
        }, 30);
    }
    var bg = setInterval(() => {
        bird.x -= 2;
        $('#container').css('backgroundPositionX', bird.x + 'px');
        Bg.BgY += 1;
        Bg.y += Bg.BgY;
        if (Bg.BgY >= 10) {
            Bg.BgY = -10;
            Bg.y += Bg.BgY;
        }
        $('#bird').css('top', Bg.y + 'px');
    }, 30);
    let one = false;
    $(document).on('keydown', (e: any) => {
        if (e.keyCode === 27 && !one) {
            one = true;
            box.css('display', 'none');
            $('#co').html(num.value);
            $('#results').html(num.value);
            clearInterval(bg);
            Bg.BgY = 0;
            setInterval(() => {
                if (flag.value) {
                    bird.x -= 5;
                    $('#container').css('backgroundPositionX', bird.x + 'px');
                    Bg.y += Bg.BgY;
                    Bg.x = Bg.BgX;
                    Bg.BgY += 1;
                    if (Bg.y <= 0) {
                        flag.value = false;
                        $('#mask').css('display', 'block');
                        $('#success').css('display', 'block');
                        $('#co').css('display', 'none');
                    }
                    if (Bg.y + $('#bird').height() >= 600) {
                        flag.value = false;
                        $('#mask').css('display', 'block');
                        $('#success').css('display', 'block');
                        $('#co').css('display', 'none');
                    }
                    $('#bird').css('top', Bg.y + 'px');
                    $('#bird').css('left', Bg.x + 'px');
                }
            }, 30);
            $(document).on('keydown', (e: any) => {
                if (e.keyCode === 32) {
                    Bg.BgY = -10;
                }
            })
            var positions = [300, 600, 900, 1200, 1500];
            positions.forEach((item: any) => {
                post(item);
            });
        }
    });
})
</script>
<template>
    <div id="container">
        <p id="co"></p>
        <div id="bird"></div>
        <h2 id="new">按下ESC键开始 && 空格键飞翔</h2>
        <div id="mask"></div>
        <div id="success">
            <h1>Game Over</h1>
            <span>最终得分：</span>
            <p id="results"></p>
        </div>
    </div>
</template>

<style lang='less' scoped>
#container {
    width: 100%;
    height: calc(100vh - 80px);
    margin: 0px auto;
    background: url(./images/sky.png);
    background-size: 100% 100%;
    position: relative;
    overflow: hidden;
    text-align: center;
}

#container #bird {
    background: url(./images/bird1.png) no-repeat;
    position: absolute;
    top: 150px;
    width: 30px;
    height: 30px;
    left: 50%;
}

#container h2 {
    font-weight: bold;
    color: pink;
    cursor: pointer;
    top: 310px;
    position: absolute;
    left: 50%;
    margin-left: -168px;
    animation: bound 0.8s linear infinite;
}

@keyframes bound {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.5);
    }

    100% {
        transform: scale(1);
    }
}

#container #success {
    width: 300px;
    height: 300px;
    font-weight: bold;
    margin: 60px -150px;
    position: absolute;
    z-index: 999;
    left: 50%;
    text-align: center;
    display: none;
}

#mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000;
    opacity: 0.8;
    z-index: 99;
    display: none;
}

#container #success h1 {
    font-size: 35px;
    margin-top: 40px;
    color: #f00;
}

#container #success #results,
span {
    margin-top: 20px;
    color: blue;
    font-size: 20px;
    font-weight: bold;
}

#container #co {
    color: red;
    font-weight: bold;
    font-size: 50px;
    position: fixed;
    top: 100px;
    left: 50%;
    z-index: 99;
}

.play {
    position: absolute;
    bottom: 240px;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    color: red;
    z-index: 999;
}
</style>