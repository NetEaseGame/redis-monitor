# -*- coding: utf-8 -*-
'''
Created on 2016-06-16

@author: hustcc
'''
from __future__ import absolute_import
from app import app
from app.database.model import RedisInfo
from app.utils import ResponseUtil, \
                      JsonUtil, \
                      RequestUtil, \
                      StringUtil, \
                      RedisUtil
from app.utils.RedisMonitor import RedisMonitor


@app.route('/', methods=['GET'])
def index_page():
    return ResponseUtil.render_template('index_page.html')


@app.route('/api/redis_list', methods=['GET'])
def redis_list():
    redis_all = RedisInfo.query.all()
    redis_all = [r.dict() for r in redis_all]
    return ResponseUtil.standard_response(1, redis_all)


@app.route('/api/redis_info', methods=['GET'])
def redis_info():
    md5 = RequestUtil.get_parameter('md5', '')
    redis_info = RedisInfo.query.get(md5)

    if redis_info:
        return ResponseUtil.standard_response(1, redis_info.dict())
    return ResponseUtil.standard_response(0, 'Not Found!')


@app.route('/api/redis_monitor', methods=['GET'])
def redis_monitor():
    try:
        md5 = RequestUtil.get_parameter('md5', '')
        redis_info = RedisInfo.query.get(md5)

        if redis_info:
            rst = RedisMonitor().get_info(host=redis_info.host,
                                          port=redis_info.port,
                                          password=redis_info.password)
        else:
            rst = {'success': 0, 'data': 'not exist redis informations!'}
    except:
        rst = {'success': 0, 'data': 'get redis realtime information error!'}
    return JsonUtil.object_2_json(rst)


@app.route('/api/ping', methods=['GET'])
def redis_ping():
    try:
        host = RequestUtil.get_parameter('host', '')
        port = RequestUtil.get_parameter('port', '6379')
        password = RequestUtil.get_parameter('password', '')

        rst = RedisMonitor().ping(host=host,
                                  port=port,
                                  password=password)
    except:
        rst = {'success': 0, 'data': 'ping error!'}
    return JsonUtil.object_2_json(rst)


@app.route('/api/add', methods=['POST'])
def add_redis():
    host = RequestUtil.get_parameter('host', '')
    port = RequestUtil.get_parameter('port', '6379')
    password = RequestUtil.get_parameter('password', '')

    try:
        rst = RedisMonitor().ping(host=host,
                                  port=port,
                                  password=password)
        if not rst.get('success', ''):
            # ping 失败
            return JsonUtil.object_2_json(rst)
    except:
        ResponseUtil.standard_response(0, 'Ping error!')

    # ping 通，添加
    md5 = StringUtil.md5(host + str(port))
    redis_info = RedisInfo.query.get(md5)
    if redis_info:
        redis_info.password = password
    else:
        redis_info = RedisInfo(md5=md5,
                               host=host,
                               port=port,
                               password=password)
    redis_info.save()
    return ResponseUtil.standard_response(1, redis_info.dict())


@app.route('/api/del', methods=['POST'])
def del_redis():
    md5 = RequestUtil.get_parameter('md5', '')
    redis_info = RedisInfo.query.get(md5)

    if redis_info:
        redis_info.delete()
        return ResponseUtil.standard_response(1, 'Success!')
    return ResponseUtil.standard_response(0, 'Not Found!')


# redis flush all
@app.route('/api/redis/flushall', methods=['GET', 'POST'])
def flushall_redis():
    try:
        md5 = RequestUtil.get_parameter('md5', '')
        db = RequestUtil.get_parameter('db', '0')

        redis_info = RedisInfo.query.get(md5)
        if redis_info:
            r = RedisUtil.flushall(redis_info.host,
                                   redis_info.port,
                                   redis_info.password,
                                   db)
            if r:
                return ResponseUtil.standard_response(1, 'Success!')
            return ResponseUtil.standard_response(0, 'Flush db error!')
        return ResponseUtil.standard_response(0, 'Not Found!')
    except:
        return ResponseUtil.standard_response(0, 'Connect to redis error!')


# 定义404页面
@app.errorhandler(404)
def page_not_found(error):
    return '404'


@app.errorhandler(502)
def server_502_error(error):
    return '502'
