# -*- coding: utf-8 -*-
'''
Created on 2015-06-16

@author: hustcc
'''
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy


# 版本号
__version__ = '1.0.3'


# flask
app = Flask(__name__)

# 加载默认 home 目录配置 redis_monitor_config.py
config_dir = os.path.join(os.path.expanduser('~'),
                          '.redis-monitor')
config_file = os.path.join(config_dir,
                           'redis_monitor_config.py')
if os.path.exists(config_file):
    app.config.from_pyfile(config_file)
else:
    # 最后从代码目录加载配置
    sqlite_file = os.path.join(config_dir, 'redis_monitor.db') \
                         .replace('\\', '/')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///%s' % sqlite_file


# flask-sqlalchemy
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
SQLAlchemyDB = SQLAlchemy(app)


from app.database import model  # noqa
from app import views  # noqa
