# redis-monitor

> A web visualization redis monitoring program. Performance optimized and very easy to install and deploy, base on Flask and sqlite. the monitor data come from redis.info().

[![点击查看中文说明文档](http://shields.hust.cc/%E7%82%B9%E5%87%BB%E6%9F%A5%E7%9C%8B-%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3-ff69b4.svg)](README_zh.md) [![Latest Stable Version](https://img.shields.io/pypi/v/redis-monitor.svg)](https://pypi.python.org/pypi/redis-monitor) [![Build Status](https://travis-ci.org/NetEaseGame/redis-monitor.svg?branch=master)](https://travis-ci.org/NetEaseGame/redis-monitor)


## What

The monitor data include: 

 - the redis server infomation [**redis.info()**], include redis version, online time, online time, os version and information, and so on.
 - realtime cmd exec infomation, such as **ops, connected count**, and so on.
 - realtime gragh of the **connect time**.
 - realtime gragh of **ops**.
 - realtime gragh of **cpu** and **mem** usage.
 - some simple operate, such as **flushdb** and add key-velue.
 - redis **role**, include master and slaves.
 
 
## Why

There are so many redis monitor code in github, why do this?

Because I clone so many program, but all exist difficult, cause by below:

 - My kownleage is pool.
 - The config not easy, I have do many thing to run the code, and I need to rewrite some code on my dev environment.
 - Incompatible versions, I can run to monitor redis 2.6, but not work with 2.8.
 - Start up not easy, some project, I need to run a data collection process, and a web process.
 - Performance Loss, when I open 10 browser tab, the monitor of other projects can exec 10 command per second.


## How to Use ?

1. Install redis-monitor

	> **pip install redis-monitor**

2. Init config & db
	
	> **redis-monitor init**

3. start webserver

	> **redis-monitor start**

Then visit [127.0.0.1:9527](http://127.0.0.1:9527/)（Port: `LZSB`，Can you get ?）, OK!


## screenshot

 - basic information

![shot_1](/doc/shot_1.png)

 - connection time gragh

![shot_2](/doc/shot_2.png)

 - ops time gragh

![shot_3](/doc/shot_3.png)

 - cpu and mem gragh

![shot_4](/doc/shot_4.png)


## LICENSE

MIT @hustcc
