# -*- coding: utf-8 -*-
'''
Created on 2016-12-07

@author
'''

import datetime
from app import SQLAlchemyDB as db
from app.database.base import BaseMethod


class RedisInfo(db.Model, BaseMethod):
    '''RedisInfo'''
    md5 = db.Column(db.String(32), primary_key=True)
    host = db.Column(db.String(32))
    port = db.Column(db.Integer, default=6379)
    password = db.Column(db.String(32))

    add_time = db.Column(db.DateTime, default=datetime.datetime.now)

    def dict(self):
        rst = {}
        rst['md5'] = self.md5
        rst['host'] = self.host
        rst['port'] = self.port
        rst['password'] = self.password
        rst['add_time'] = self.add_time
        return rst
