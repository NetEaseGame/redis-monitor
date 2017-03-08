# -*- coding: utf-8 -*-
'''
Created on 2015-06-16

@author: hustcc
'''
import hashlib


def md5_salt(s, salt="redis-monitor"):
    '''
    md5 + 盐：即便两个用户使用了同一个密码，由于系统为它们生成的salt值不同，他们的散列值也是不同的。
    '''
    if s:
        return md5(s + salt)
    else:
        return ''


def md5(s):
    '''
    md5
    '''
    s = s.encode('utf-8')
    m = hashlib.md5()
    m.update(s)
    return m.hexdigest()
