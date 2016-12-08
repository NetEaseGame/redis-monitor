# -*- coding: utf-8 -*-
'''
Created on 2015-08-21
单利模式装饰器
@author: hustcc
'''


def singleton(cls, *args, **kw):
    instances = {}

    def _singleton():
        if cls not in instances:
            instances[cls] = cls(*args, **kw)
        return instances[cls]
    return _singleton
