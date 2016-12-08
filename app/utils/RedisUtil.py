# -*- coding: utf-8 -*-
'''
Created on 2015年11月26日
一些reids的操作类，用于执行网页前段发送的redis命令
@author: hustcc
'''
import redis


# 删除所有
def flushall(host, port, password, db):
    r = redis.Redis(host=host, port=int(port), password=password, db=int(db))
    return r.flushdb()


# 添加一个键值
def set_value(host, port, password, db, key, value, timeout=-1):
    r = redis.Redis(host=host, port=int(port), password=password, db=int(db))
    return r.setex(key, value, timeout)


# 删除键值
def del_key(host, port, password, db, key):
    r = redis.Redis(host=host, port=int(port), password=password, db=int(db))
    return r.delete(key)
