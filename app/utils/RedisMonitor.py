# -*- coding: utf-8 -*-
'''
Created on 2015年9月2日

@author: hustcc
'''
from __future__ import absolute_import
from app.wraps import singleton_wrap
from app.wraps import wrapcache
import time
import redis


# 每秒中刷新一次
@wrapcache.wrapcache(timeout=10)
def new_request(host, port, password, charset='utf8'):
    redis_rst = {}
    # 需要重新请求获得数据
    try:
        start = time.time()

        r = redis.Redis(host=host, port=int(port), password=password)
        info = r.info()
        end = time.time()
        info['get_time'] = (end - start) * 1000  # change to ms

        redis_rst['success'] = 1
        redis_rst['data'] = info
    except:
        redis_rst['success'] = 0
        redis_rst['data'] = 'error'

    return redis_rst


@singleton_wrap.singleton
class RedisMonitor(object):
    def __init__(self):
        self.servers = {}

    def ping(self, host, port, password, charset='utf8'):
        if host and port:
            redis_rst = {}
            # 需要重新请求获得数据
            try:
                r = redis.Redis(host=host, port=int(port), password=password)
                r.info()

                redis_rst['success'] = 1
                redis_rst['data'] = 'Ping success!'
            except:
                redis_rst['success'] = 0
                redis_rst['data'] = 'Ping error!'

            return redis_rst
        else:
            # 如果host，port非法，则直接返回错误
            return {'success': 0, 'data': 'Parameter error!'}

    def get_info(self, host, port, password, charset='utf8'):
        redis_rst = {}
        if host and port:
            redis_rst = new_request(host, port, password, charset)
        else:
            # 如果host，port非法，则直接返回错误
            redis_rst = {'success': 0, 'data': 'Parameter error!'}
        return redis_rst
