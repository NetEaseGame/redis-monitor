# redis-monitor

> 一个 web 可视化，性能优化的 redis 监控程序，使用 flask + sqlite 完成，使用简单，部署方便。

[![Latest Stable Version](https://img.shields.io/pypi/v/redis-monitor.svg)](https://pypi.python.org/pypi/redis-monitor) [![Build Status](https://travis-ci.org/NetEaseGame/redis-monitor.svg?branch=master)](https://travis-ci.org/NetEaseGame/redis-monitor) 


## What

监控数据包括以下：

 - redis 服务器信息（**redis.info()**），包括 redis 版本、上线时间、os系统信息等等
 - 实时的**消息处理信息**，例如处理 command 数量、连接总数量等
 - **联通时间**动态图表
 - **ops** 时间动态图表
 - **内存**占用、**cpu** 消耗实时动态图表
 
 
## Why

redis监控程序很多，为什么还要自己做？

因为我找了很多网上推荐的程序，存在一些问题，导致我没有用起来，除了自己知识欠缺的问题，主要包括：

1. 配置麻烦，需要修改代码中的配置文件，而且太难找；
2. 版本不兼容，不记得是哪个项目，2.8 可以跑起来，但是 2.6 完全直接启动出错，我也不知道怎么去修改，原谅我的无知；
3. 启动麻烦，需要启动两个东东，我也不知道为什么，可能是为了性能上的东西吧！
4. 监控程序带来 redis 性能损耗。


## How to Use ?

1. 首先安装python库

	> **pip install redis-monitor**

2. 初始化配置和数据库
	
	> **redis-monitor init**

3. 启动 webserver

	> **redis-monitor start**

然后访问 [127.0.0.1:9527](http://127.0.0.1:9527/)（端口：`LZSB`，你懂的） 即可。


## Screenshot

 - basic information

![shot_1](/doc/shot_1.png)

 - connection time gragh

![shot_2](/doc/shot_2.png)

 - ops time gragh

![shot_3](/doc/shot_3.png)

 - cpu and mem

![shot_4](/doc/shot_4.png)


## LICENSE

MIT @hustcc