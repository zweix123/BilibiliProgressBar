// ==UserScript==
// @name         B站合集总进度条
// @namespace    http://tampermonkey.net/
// @version      0.2
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

    window.onload = function () {
        let number = 3;  // 等待页面加载时间，经验值

        void function (time) {  // 匿名sleep函数，用于等待网页加载完
            return new Promise((resolve) => setTimeout(resolve, time));
        }(number * 1000).then(() => {
            // 通过检测分P栏的表头长度区分是否是有分P的视频
            if (document.getElementsByClassName('cur-page').length == 0) return;

            console.log("start handle.");
            mainBilibiliProgressBar();  // 竞赛写法
        });
    }

    /**
     * 获得对应集数的信息
     * @param {int} index 第几集
     * @returns
     */
    function get_info(index) {
        let hour = 0, minute = 0, second = 0;

        // 区分合集类视频和订阅类视频
        let tarclass = "";
        if (document.getElementsByClassName('video-sections-head_desc').length != 0) {
            tarclass = 'video-episode-card__info-duration';
        } else {
            tarclass = 'duration';
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
        minute += Math.floor(second / 60);
        second %= 60;
        hour += Math.floor(minute / 60);
        minute %= 60;

        let sum_time = hour * 3600 + minute * 60 + second;

        return { index, hour, minute, second, sum_time }
    }

    function mainBilibiliProgressBar() {
        // 分P栏的表头, 利用正则表达式提取出想要的信息
        let cur_index = parseInt(document
            .getElementsByClassName('cur-page')[0]
            .innerHTML.match(/(\d+)\//)[1]);
        let end_index = parseInt(document
            .getElementsByClassName('cur-page')[0]
            .innerHTML.match(/\/(\d+)/)[1]);

        let cur_info = get_info(cur_index);
        let end_info = get_info(end_index);
        let remain_time = end_info.sum_time - cur_info.sum_time;
        let remain_minute = (remain_time / 60);
        let remain_hour = (remain_minute / 60);
        remain_minute %= 60;

        const had_time_str = cur_info.hour.toString() + "h" + cur_info.minute.toString() + "m";
        const had_rate_str = (cur_info.sum_time / end_info.sum_time * 100).toFixed(1).toString() + "%";
        const remain_time_str = parseInt(remain_hour).toString() + "h" + parseInt(remain_minute).toString() + "m";

        handle_button(had_time_str, had_rate_str, remain_time_str);
    }

    function handle_button(had_time_str, had_rate_str, remain_time_str) {
        let plain = document.getElementsByClassName('video-info-detail')[0];// 确定位置
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
            button_var.addEventListener("click", mainBilibiliProgressBar);  // 更新方案, 手动点击按钮来更新, 为何不采用更自动的方案见README
        }

        button_var.innerHTML = "已看" + had_time_str + "（" + had_rate_str + "）, 还剩" + remain_time_str;

        if (isNULL) plain.appendChild(button_var);
    }

    //})();

    // Your code here...
})();