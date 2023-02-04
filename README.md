# 效果
![](https://cdn.jsdelivr.net/gh/zweix123/BilibiliProgressBar/img/ege.png)


# 使用

0. 需要了解浏览器油猴脚本插件的使用方式
1. 在油猴中新建用户脚本，将项目中的js代码覆盖进去

+ 油猴脚本会自动识别B站合集类视频的网址并运行脚本
+ 代码逻辑见代码注释

# 介绍

众所周知，B站是一个学习的地方。

需求：在B站看公开课时，一般是合集类型，网站提供了课程的总时长、合集总集数以及目前看到第几集。但是一方面不同集之间可能时长差别较大，另一方面就我个人而言用集数占比这种方式比较抽象，比较希望有一个时间维度上的总进度条。

-----

比较有趣的是我是怎么开发出来的
1. 在有了上面的需求后，我还是个只会C的小菜鸟，于是准备用C写
	+ 原理：手动将看过的视频的时间输入到特定的文件，运行程序中进行计算。
	+ 缺点：每看过一个视频都需要手动输入一下，本质只是用计算机代替人脑的计算过程。

2. 后来学习到了Python，了解到OCR图像识别
	>OCR是一种图像识别技术，谷歌的tesseract实现了这些功能，pytesseract是python对它的接口。

	+ 每看过几个视频，想要得到看过的时间，将看过的视频的时间（B站合集分P右部分有显示）截屏保存，利用python的图像识别识别出内容再计算。
	+ 缺点：截屏仍然也比较麻烦，还需记录看到哪里，而且这终究需要人输入。

3. 
   >这期间我了解到了网络爬虫，打开了B站合集的源代码，发现合集里每个分P的时间都有在源代码中显示，考虑能否通过python的网络编程读取到这些信息然后计算。

4. 
   > 网页？前端三件套才是根正苗红呀
   >
   > > 截至到2022.3.16的认知：
   > >
   > > + Js负责逻辑——可以实现我的目的
   > > + 其语法类似Java——也许我可以即使没有学过也能开发出来
   >
   > 于是我决定放弃爬虫选用js写

   + 原理：对于视频右边的分P栏

     1. 含有(正在看的视频索引/总视频数量)的对象类名为`'cur-page'`
     2. 含有每个视频的信息的元素对象名为`'duration[]'`，通过索引获得每集的显示信息

     通过正则表达式获取需要的信息

   + 缺点：现在的运行流程是在看的视频中点击F12打开开发模式，在console中复制进入js代码——还需要人的操作。

5. 
   > 想要自动管理js代码，于是想到自定义浏览器插件，在好朋友的提醒下根本不需要大张旗鼓的再写一个插件，油猴脚本可以处理一些细枝末节的东西，让我们专注于逻辑
   
   + 原理：与v4版本类似，这里只是运用油猴脚本自动运行我们的代码
   
     问题在于油猴脚本和网站的加载是一同进行的，此时会出现油猴脚本需要网站中的一些元素，但他们还没有刷新出来，解决方案是新学到了一个定时操作，在代码的第18行设定等待（网站刷新）时间，如果使用时仍然不够可延长
   
   + 在打开B站合集的时候自动弹出标签，且不影响原页面的使用
   
     在切换合集时需要手动点击该标签更新内容

# 鸣谢

+ 代码主要借鉴这两位前辈的代码

  + 逻辑：[B站分集视频教程时长统计脚本](https://www.52pojie.cn/thread-1517520-1-1.html)
  + 显示方案：[https://greasyfork.org/zh-CN/scripts/431734-哔哩哔哩工具-快捷键-视频时长](https://greasyfork.org/zh-CN/scripts/431734-%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%B7%A5%E5%85%B7-%E5%BF%AB%E6%8D%B7%E9%94%AE-%E8%A7%86%E9%A2%91%E6%97%B6%E9%95%BF)

  侵删。

+ 在开发过程中特别是关于Javascript的问题受到学校学长的很多帮助。

在此一并表示感谢

# Log

+ 在蒋炎岩老师的视频好像出问题，后续再改bug