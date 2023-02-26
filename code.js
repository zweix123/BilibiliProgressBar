// ==UserScript==
// @name         B站合集总进度条
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于B站的合集在时间维度上的总进度，设计时尽可能解耦，利于个性化修改
// @author       zweix
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none

// ==/UserScript==
// @require      file://C:\Users\zweix\Projects\BilibiliProgressBar\code.js


(function () {
    'use strict';

    // javascript:( //function () {

    window.onload = function () {  // like main function
        let number = 5;  // 等待页面加载时间, 是一个经验值, 如果不合适可以修改

        void function (time) {  // 匿名的sleep函数, 用于等网页加载完, 照猫画虎写的
            return new Promise((resolve) => setTimeout(resolve, time));
        }(number * 1000).then(() => {
            let list = document.getElementsByClassName('cur-page');  // 获得分P栏的表头, 普通视频长度为0, 以此判断是否运行程序
            if (list.length == 0) return;
            solve();  // 竞赛写法
        })
    }

    function get_info(index) {  // 对应一个索引(对应集数), 获得从开始到当前的时间
        let hour = 0, minute = 0, second = 0;

        // 区分合集类视频和订阅类视频
        let tarclass = "";
        if (document.getElementsByClassName('video-sections-head_desc').length != 0) {
            tarclass = 'video-episode-card__info-duration'
        } else {
            tarclass = 'duration'
        }

        for (let i = 0; i < index; ++i) {
            let time_tuple = document
                .getElementsByClassName(tarclass)[i]  // 每个栏的时间
                .innerHTML.match(/\d+/g);

            if (time_tuple.length == 2) time_tuple.unshift('0');  // 不足小时, 手动添加
            hour += parseInt(time_tuple[0]);
            minute += parseInt(time_tuple[1]);
            second += parseInt(time_tuple[2]);
        }
        minute += Math.floor(second / 60); second %= 60;
        hour += Math.floor(minute / 60); minute %= 60;

        let sum_time = hour * 3600 + minute * 60 + second;

        return { index, hour, minute, second, sum_time }
    }

    function solve() {
        // 分P栏的表头, 利用正则表达式提取出想要的信息
        let cur_index = parseInt(document
            .getElementsByClassName('cur-page')[0]
            .innerHTML.match(/(\d+)\//)[1]);
        let end_index = parseInt(document
            .getElementsByClassName('cur-page')[0]
            .innerHTML.match(/\/(\d+)/)[1]);

        let cur_info = get_info(cur_index)
        let end_info = get_info(end_index)

        show(cur_info.hour + "小时" + cur_info.minute + "分钟", (cur_info.sum_time / end_info.sum_time * 100).toFixed(1))
    }

    function show(sum_time, percentage) {
        let plain = document.getElementsByClassName('video-data')[0];// 确定位置
        let button_var = document.getElementById('button_tag_zweix');       // 原因见下
        // 因为这个地方要更新, 这里的策略是如果没有就创建, 没有就在其基础上修改
        let isNULL = (button_var === null);

        if (isNULL) {
            button_var = document.createElement('button');
            button_var.setAttribute('id', 'button_tag_zweix');
            button_var.style = '\n' +
                '    background-color: #24c7b4;\n' +
                '    color: white;\n' +
                '    font-size: 1rem;\n' +
                '    text-align: center;\n' +
                '    margin-left: 1rem;\n' +
                '    padding:0.5rem;\n' +
                '    cursor: pointer;\n' +
                '    ';
            button_var.addEventListener("click", solve);  // 更新方案, 手动点击按钮来更新, 为何不采用更自动的方案见README
        }

        button_var.innerHTML = "共用时" + sum_time + " 已完成" + percentage + "%";

        if (isNULL) plain.appendChild(button_var);
    }

    //})();

    // Your code here...
})();