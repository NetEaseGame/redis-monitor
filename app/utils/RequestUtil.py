# -*- coding: utf-8 -*-
'''
Created on 2015-08-21

@author: hustcc
'''

from flask.globals import request


# get / post data
def get_parameter(key, default=None):
    '''
    info:获得请求参数，包括get和post，其他类型的访问不管
    '''
    # post参数
    if request.method == 'POST':
        param = request.form.get(key, default)
    # get
    elif request.method == 'GET':
        param = request.args.get(key, default)
    else:
        return default

    return param
