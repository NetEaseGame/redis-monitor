# -*- coding: utf-8 -*-
'''
Created on 2016-11-30

@author: hustcc
'''
from distutils.core import setup
from setuptools import find_packages
import os
import re
import io

packages = find_packages('app')


LONGDOC = """
redis-monitor is a web app base on
    Python Flask + SQLAchemy + Redis + React.

Aims to deploy a redis monitor platform easily

How to deploy & run ?

> pip install redis-monitor

1. redis-monitor init : will init config into HOME dir,
                            then you can modify it or not.

2. redis-monitor createdb : will init database. (optional)

3. redis-monitor start : run web server, with default port 9527 (LZSB)


> then visit ip:9527
"""


def read(*names, **kwargs):
    return io.open(
        os.path.join(os.path.dirname(__file__), *names),
        encoding=kwargs.get("encoding", "utf8")
    ).read()


def find_version(*file_paths):
    version_file = read(*file_paths)
    version_match = re.search(r"^__version__ = ['\"]([^'\"]*)['\"]",
                              version_file, re.M)
    if version_match:
        return version_match.group(1)
    raise RuntimeError("Unable to find version string.")


setup(name='redis-monitor',
      version=find_version('app/__init__.py'),
      description=(u'使用Flask开发的一个 web 可视化的 redis 监控程序，'
                   u'可以查看 redis 的服务器信息、实时监控 '
                   u'redis 的消息处理 ops、内存占用、cpu 消耗，以及 redis 联通时间。 '
                   u'A web visualization redis monitoring program. '
                   u'Performance optimized and '
                   u'very easy to install and deploy. '
                   u'the monitor data come from redis.info().'),
      long_description=LONGDOC,
      author='hustcc',
      author_email='vip@hust.edu.cn',
      url='https://github.com/hustcc',
      license='MIT',
      install_requires=[
        'flask==0.11.1',
        'flask-sqlalchemy==2.1',
        'pymysql==0.7.9',
        'jinja2==2.8',
        'redis==2.10.5',
        'Flask-Script==2.0.5'
      ],
      classifiers=[
        'Intended Audience :: Developers',
        'Operating System :: OS Independent',
        'Natural Language :: Chinese (Simplified)',
        'Programming Language :: Python',
        'Programming Language :: Python :: 2',
        'Programming Language :: Python :: 2.5',
        'Programming Language :: Python :: 2.6',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
        'Topic :: Software Development',
        'Topic :: Utilities'
      ],
      keywords='redis, monitor, redis-monitor, redis client, redis usage',
      include_package_data=True,
      packages=['app'],
      py_modules=['manage'],
      zip_safe=False,
      entry_points={
        'console_scripts': ['redis-monitor=manage:run']
      })
