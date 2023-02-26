// ==UserScript==
// @name         B站"稍后再看"总时间
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description
// @author       zweix
// @match        https://www.bilibili.com/watchlater/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @require      file://C:\Users\zweix\Projects\BilibiliProgressBar\else\code.js

// ==/UserScript==


(function () {
    'use strict';

    // javascript:( //function () {

    // 代码借鉴自合集类视频总进度条脚本
    window.onload = function () {  // like main function
        let number = 3;  // 等待页面加载时间, 是一个经验值, 如果不合适可以修改

        void function (time) {  // 匿名的sleep函数, 用于等网页加载完, 照猫画虎写的
            return new Promise((resolve) => setTimeout(resolve, time));
        }(number * 1000).then(() => {
            solve();  // 竞赛写法
        })
    }

    function solve() {
        let root_div = document.getElementsByClassName('av-item')
        let hour = 0, minute = 0, second = 0
        for (let i = 0; i < root_div.length; ++i) {
            let time_tuple = root_div[i].innerHTML.match("class=\"corner\">.*</span>")[0].match(/\d+/g)
            if (time_tuple.length == 2) time_tuple.unshift('0');
            hour += parseInt(time_tuple[0]);
            minute += parseInt(time_tuple[1]);
            second += parseInt(time_tuple[2]);
        }
        minute += Math.floor(second / 60); second %= 60;
        hour += Math.floor(minute / 60); minute %= 60;

        show("有" + hour + "小时" + minute + "分钟")
    }

    function show(sum_time) {
        let plain = document.getElementsByClassName('t')[2];// 确定位置

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

        button_var.innerHTML = sum_time

        if (isNULL) plain.appendChild(button_var);
    }

    // Your code here...
})();