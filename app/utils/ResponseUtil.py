# -*- coding: utf-8 -*-
'''
Created on 2016-02-19

@author: hustcc
'''
from __future__ import absolute_import
from app.utils import JsonUtil
import flask


def standard_response(success, data):
    '''standard response
    '''
    rst = {}
    rst['success'] = success
    rst['data'] = data
    return JsonUtil.object_2_json(rst)


# 重写 render_template 写入固定的一些参数
def render_template(*args, **kwargs):
    return flask.render_template(*args, **kwargs)
